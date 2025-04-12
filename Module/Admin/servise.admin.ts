import { AdminProESPEntity } from "../../entity/Admin";
import { AppDataSource } from "../../TypeORM/TypeORM";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type {  Request, Response } from "express";
import { AppConfig } from "../../config/app.config";
import JWT from 'jsonwebtoken'
import { sendEmail } from "../../ForgetPassword/ForgetPassword";
const AdminRepo = AppDataSource.getRepository(AdminProESPEntity)



export class AdminController {
  static async RegisterAdmin(req: Request, res: Response) {
    const { body } = req;

    if (!body) {
      res.json({ message: "there is not data" });
      return;
    }
    const { email, name, password } = body;
    const checkEmail = await AdminRepo.findOne({
      where: { email: email },
    });

    if (checkEmail) {
      res.json({ message: "the Email is a ready exsit" });
      return;
    }

    bcrypt.hash(password, 12, async (err, hashPassword) => {
      if (err) {
        res.json({ message: "err is password" });
        return;
        // throw err;
      }
      const time = `${
        new Date().getDate() < 10
          ? `0${new Date().getDate()}`
          : `${new Date().getDate()}`
      }-${
        new Date().getMonth() + 1 < 10
          ? `0${new Date().getMonth() + 1}`
          : `${new Date().getMonth() + 1}`
      }-${new Date().getFullYear()}   at  ${
        new Date().getHours() < 10
          ? `0${new Date().getHours()}`
          : `${new Date().getHours()}`
      } : ${
        new Date().getMinutes() < 10
          ? `0${new Date().getMinutes()}`
          : `${new Date().getMinutes()}`
      }`;

      const emailTk = crypto.randomBytes(16).toString("base64");
      const createAdmin = await AdminRepo.create({
        email: email,
        password: hashPassword,
        name: name,
        emailTk,
        lasteUpdatePassword: time,
      });

      if (!createAdmin) {
        res.status(400).json({ message: "Failed to creat Admin" });
        return;
      }

      await AdminRepo.save(createAdmin);

      res.json({ message: "Admin is create" });
      return;
    });
  }

  static async login(req: Request, res: Response) {
    const { body } = req;

    try {
      const checkEmail = await AdminRepo.findOne({
        where: { email: body.email },
      });

      if (!checkEmail) {
        res.json({ message: "forbiden : email" });
        return;
      }

      bcrypt.compare(body.password, checkEmail.password, async (err, rp) => {
        if (err) {
          res.json({ message: "err is password" });
          return;
        }
        if (!rp) {
          res.json({ message: "password is wongr" });
          return;
        }

        const Accssetoken = JWT.sign(
          { id: checkEmail.id },
          AppConfig.SECRETKEY!
        );

        res.json({
          message: "Succes",
          user: checkEmail,
          token: Accssetoken,
        });
        return;
      });
    } catch (err) {
      console.log("Err from login server => ", err);
      res.status(500).json({ message: "login err : from server " });
      return;
    }
  }

  static async updateAdmin(req: Request, res: Response) {
    const { admin } = req.body;
    console.log("Admin", req.body.formData);

    const update = await AdminRepo.update(req.body.admin.id, {
      name: req.body.formData.name,
      email: req.body.formData.email,
    });
    if (!update) {
      res.json({ message: "the admin is not update" });
      return;
    }

    (admin.name = req.body.formData.name),
      (admin.email = req.body.formData.email),
      res.status(200).json({ message: "admin is update", admin });
    return;
  }

  static async updatePass(req: Request, res: Response) {
    const time = `${
      new Date().getDate() < 10
        ? `0${new Date().getDate()}`
        : `${new Date().getDate()}`
    }-${
      new Date().getMonth() + 1 < 10
        ? `0${new Date().getMonth() + 1}`
        : `${new Date().getMonth() + 1}`
    }-${new Date().getFullYear()}   at  ${
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`
    } : ${
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`
    }`;

    bcrypt.hash(req.body.password, 12, async (err, ha) => {
      if (err) {
        res.json({ message: err });
        return;
      }
      await AdminRepo.update(req.body.admin.id, {
        password: ha,
        lasteUpdatePassword: time,
      });
      req.body.admin.lasteUpdatePassword = time;
      res.json({ message: "pass is updated", admin: req.body.admin });
      return;
    });
  }

  static async checkToken(req: Request, res: Response) {
    if (!req.body.admin) {
      res.json({
        message: "the token is invalide try next time",
        status: false,
      });
      return;
    }
    res.json({
      message: "the token is valide",
      status: true,
      admin: req.body.admin,
    });
    return;
  }

  static async getAll(req: Request, res: Response) {
    const getAll = await AdminRepo.find();
    res.json({ getAll });
    return;
  }

  static async getEmail(req: Request, res: Response){
   await sendEmail(req.body.email , req.body.admin.emailTk)
   res.json({ message: "email sent", emailTk: req.body.admin.emailTk });
   return
  }

  static async addNewPassword(req:Request, res:Response){
     const {emailTk , password} = req.body
     console.log(44444 , req.body);
     

     const getAdmin = await AdminRepo.findOne({
       where:{
         emailTk
       }
     })
     console.log(getAdmin);
     

     if(!getAdmin){
      res.json({message:'User Not Found'})
      return
     }

     bcrypt.hash(password , 12 , async (err, ha)=>{
       if(err){
         res.json({message:'err from hash'})
         return
       }
        getAdmin.password = ha;
        await AdminRepo.save(getAdmin)
        res.json({message:'password Add'})
        return
     })
  }


}
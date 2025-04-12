import { AppConfig } from "../../config/app.config";
import JWT, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../TypeORM/TypeORM";
import { AdminProESPEntity } from "../../entity/Admin";
import bcrypt from "bcrypt";

const AdminRepo = AppDataSource.getRepository(AdminProESPEntity)

export const getAdminMiddelWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 
    console.log(req.headers.authorization);

    
    
    const tokenReq = req.headers.authorization!.split(" ");

    if(!tokenReq){
        res.json({ message: "token not exsit", status: false });
        return
    }

    if (tokenReq[0] !== "Bearer") return res.json({ message: "Forbiden", status: false });

  

    if(!tokenReq[1] || tokenReq[1] == '' ){
       res.json({ message: "worng Token" , status : false});
       return;
    }
    

    const verifyToken = JWT.verify(tokenReq[1] , AppConfig.SECRETKEY!) as JwtPayload;
    // console.log('JJDJDJ',verifyToken);
    
    if(!verifyToken){
      res.json({ message: "worng Token"});
      return
    }

    const getAdmin = await AdminRepo.findOne({
      where: { id: verifyToken.id },
    });
    req.body.admin = getAdmin;
    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message == "jwt expired") {
        res.status(401).json({message : "Token is dead", status : false});
        return;
      }
      if(err.message == 'jwt malformed'){
       res.json({message:'worng Token' , status: false})
       return
    }
    }
  }
};



export const confirmePassworOld = (
  req: Request,
  res: Response,
  next: NextFunction
) => {


  bcrypt.compare(
    req.body.oldPassword,
    req.body.admin.password,
    async (err, rp) => {
      if (err) {
        res.json({ message: "err from hash pass" });
        console.log("err pass", err);
        return;
      }
      if (!rp) {
        res.json({ message: "the pass is not mush" });
        return;
      }
      next();
    }
  );
};

export const getUserByEmail = async (req:Request,res:Response , next:NextFunction)=>{
   const {email} = req.body 

   
   const getEmail = await AdminRepo.findOne({ where: { email: email } });
   if(!getEmail){
     res.json({message:'email not exsit'})
     return
   }
   req.body.admin = getEmail
   next()
}





import {type Request , type Response} from 'express'
import { AppDataSource } from '../../TypeORM/TypeORM'
import { Robot } from '../../entity/Robot'
const repoRo = AppDataSource.getRepository(Robot)


export class RobotControllers {
  static async getDataFromRobot() {}

  static async AddRo(req:Request, Response:Response) {
     const {body} = req
     const addR = await repoRo.create({
          name: body.name,
          location:["12", "3"],
          start: true,
          finich: false
     })
  }
}
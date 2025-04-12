import {type Request , type Response} from 'express'
import { AppDataSource } from '../../TypeORM/TypeORM'
import { Robot } from '../../entity/Robot'
const repoRo = AppDataSource.getRepository(Robot)


export class RobotControllers {
  static async getDataFromRobot(req:Request, res:Response) {
    const getRobot =  await repoRo.find()
    res.json({message:'it get' , data:getRobot})
    return
  }

 
}
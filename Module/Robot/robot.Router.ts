import express from "express"
import { RobotControllers } from "./servise.robot"


const RouterRobot = express.Router()


RouterRobot.get('/getRobot' , RobotControllers.getDataFromRobot)

export default RouterRobot
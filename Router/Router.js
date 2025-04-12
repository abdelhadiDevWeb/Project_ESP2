import express from 'express'
import RouterAdmin from '../Module/Admin/Admin.Router'
import RouterRobot from '../Module/Robot/robot.Router'


const RouterApp = express.Router()


RouterApp.use('/admin',RouterAdmin)
RouterApp.use('/robot' , RouterRobot)






export default RouterApp
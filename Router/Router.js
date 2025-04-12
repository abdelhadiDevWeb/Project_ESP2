import express from 'express'
import RouterAdmin from '../Module/Admin/Admin.Router'


const RouterApp = express.Router()


RouterApp.use('/admin',RouterAdmin)






export default RouterApp
import express from 'express'
import { AdminController } from './servise.admin';
import { confirmePassworOld, getAdminMiddelWare, getUserByEmail } from './MiddelWare.admin';


const RouterAdmin = express.Router()


RouterAdmin.post(
  "/register",
  AdminController.RegisterAdmin
);



RouterAdmin.post("/login",
  AdminController.login
);

RouterAdmin.post(
  "/updateAdmin",
  getAdminMiddelWare,
  AdminController.updateAdmin
);


RouterAdmin.get("/checkToken", getAdminMiddelWare, AdminController.checkToken);

RouterAdmin.get("/getAlladmin", AdminController.getAll);

RouterAdmin.post(
  "/upadatePassword",
  getAdminMiddelWare,
  confirmePassworOld,
  AdminController.updatePass
);

RouterAdmin.post("/addpassword", AdminController.addNewPassword);
RouterAdmin.post("/getEmail", getUserByEmail, AdminController.getEmail);





export default RouterAdmin
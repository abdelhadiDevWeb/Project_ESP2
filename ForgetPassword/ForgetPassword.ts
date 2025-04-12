import nodemalier from 'nodemailer'
import { AppConfig } from '../config/app.config';



const Transport = nodemalier.createTransport({
  service: "Gmail",
  auth: {
    user: "code51507@gmail.com",
    pass: "pouvqlwhdpovmhwo",
  },
});

export const sendEmail = async (email:string , emailTk:string)=>{
   try {
       Transport.sendMail({
         from: "code51507@gmail.com",
         to: email,
         subject: "New Password",
         html: ` <div style="text-align: center; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
                <div style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); display: inline-block;">
                    <h1 style="color: #333;">Forget Password</h1>
                    <h3 style="color: #555;">Click the button below to reset your password:</h3>
                    <a href="${AppConfig.URLFRONT}addpassword/${emailTk}" 
                       style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
            </div>`,
       });
   } catch (err) {
    console.log('validation err ' , err);
    return err
    
   }
}



import * as Joi from 'joi'


export const AppConfig = {
  PORT: process.env.PORT,
  SECRETKEY: process.env.SECRETKEY,
  URLFRONT : process.env.URLFRONT
};



const SchemaValidationAppConfig = Joi.object({
  PORT: Joi.string().required(),
  SECRETKEY: Joi.string().required(),
  URLFRONT : Joi.string().required() 
});



export const ValidateDataAppConfig = (callBack:()=>void)=>{
    const {error} = SchemaValidationAppConfig.validate(AppConfig)

    if(error){
        return error.message
    }
    callBack()
}
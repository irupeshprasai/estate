import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const user = (req, res) =>{
    res.json({
        message:'Hello World!'
    });
};

export const updateUser  = async(req,res,next) =>
    {        
        if(req.user.id != req.params.id)
            {
                return next(errorHandler('401',"You can only update your own account"));
            }
            let newPasword = req.body.formData.password;
          
        //const{userName,email,password,avatar} = req.body;
        try{
            if(newPasword){
                newPasword = bcryptjs.hashSync(newPasword,10);
            }
            const updateUser = await User.findByIdAndUpdate(req.params.id,{
                $set:{
                    username:req.body.formData.userName,
                    email:req.body.formData.email,
                    password:newPasword,
                    avatar:req.body.formData.avatar
                }
            }, {new: true});
            const {password, ...rest} = updateUser._doc;
            res.status(200).json(rest);
        }
        catch(error)
        {
            next(error);
        }
    }

    export const deleteUser = async(req,res,next) => 
        {
            if(req.user.id != req.params.id)
                {
                    return next(errorHandler('401',"You can only delete your own account"));
                }
                try{
                  
                    await User.findByIdAndDelete(req.user.id);
                    res.clearCookie('access_token');
                    res.status(200).json('User has been deleted');
                }
                catch(error)
                {
                    next(error);
                }
        }




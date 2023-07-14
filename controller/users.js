const user = require('../model/users')
const bcrypt = require('bcryptjs')
const joi = require('joi')
const jwt = require('jsonwebtoken')


const usersSchema = joi.object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    email: joi.string().min(3).required().email(),
    password: joi.string().min(8).required(),
    confirmpassword: joi.string().min(8).required(),
    confirmpassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});
const emailExist = async (req, res) => {
    const emailfound = await user.findOne({ email: req.body.email })
    if (emailfound) {
        return res.status(400).send("Email already exist")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const hashedconf = await bcrypt.hash(req.body.confirmpassword, salt);

    const createUser = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPass,
        confirmpassword: hashedconf
    })


    try {
        const { error } = await usersSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send(error)
        }
        else {

            await createUser.save();
            return res.status(201).send("Registration sucessfull please Login");
        }
    }
    catch (error) {
        res.status(400).send(error)

    }
}
//login

const loginSchema= joi.object({
    email:joi.string().min(3).required().email(),
    password:joi.string().min(6).required(),
})
const emaillogin= async(req,res)=>{
  const User =  await user.findOne({email:req.body.email})
     if(!User){
           return res.status(400).send("Invalid email")
     }
    
     const validPassword= await bcrypt.compare(req.body.password,User.password);
     if(!validPassword)
     return res.status(400).send("Invalid password");

     try{
        const{error}= await loginSchema.validateAsync(req.body);
        if(error){
            res.status(400).send(error)
        }
        else{
               const token=jwt.sign({email:User.email},process.env.TOKEN_SECRET);
               res.header("auth_token",token).send(token);
        }
    
     }
     catch(error){
                res.status(400).send(error)
     }


    }
// login verification
    const verifylogin= async(req,res)=>{
        const {token}=req.body
        
        try{
            const verify=jwt.verify(token,process.env.TOKEN_SECRET)
            if( verify){
                   await user.findOne({email:verify.email})
                  .then((data)=>{ 
                    res.status(200).send({data})})
            
            }
            
        }
        catch{
                res.status(400).send('invalid token')
        }
    }


module.exports.emaillogin=emaillogin;
module.exports.emailExist = emailExist;
module.exports.verifylogin=verifylogin;

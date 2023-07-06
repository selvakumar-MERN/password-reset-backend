const user = require('../model/users')
const bcrypt = require('bcryptjs')
const joi = require('joi')


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



module.exports.emailExist = emailExist;

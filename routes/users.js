const express=require('express')

const userData=require('../controller/users')
const passwordReset=require('../controller/passwordreset')
const router= express.Router();

router.post('/register',userData.emailExist);
router.post('/verify',passwordReset.emailverify)
router.post('/resetpassword/:token',passwordReset.resetpassword);
router.post('/verifyuser/:token',passwordReset.verifytoken);
router.post('/login',userData.emaillogin)
router.post('verifylogin',userData.verifylogin)


module.exports=router;

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult} = require('express-validator');
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const config = require('config')


router.post('/', [
 check('name', 'Name is required').not().isEmpty(),
 check('email', 'Please include a valid emial address').isEmail(),
 check('password', 'Please enter password of 6 or more characters').isLength({min:6})
],
async (req, res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
  return res.status(400).json({errors: error.array()});
 }
 const{name, email, password} = req.body;
try{



 // see if user exists
 let user = await User.findOne({email});
 if(user){
  return res.status(400).json({errors:[{msg:'User already exists'}]});
 }


 //get users gravatar
 const avatar = gravatar.url(email,{
  s:'200',
  r:'pg',
  d:'mm'
 })

 user = new User({
  name,
  email,
  avatar,
  password
 })

 //Encrypt password using bcrypt
 const salt = await bcrypt.genSalt(10);

 user.password = await bcrypt.hash(password, salt);

 await user.save();


 //return jsonwebtoken
 const payload = {
  user:{
   id: user.id
  }
 }
 jwt.sign(payload, config.get('jwtSecret'),{
  expiresIn: 3600000
 },
(err, token)=>{
 if(err) throw err;
 res.json({token});
});
 

}catch(err){
 console.error(err.message)
 res.status(500).send('server error')
}

});

module.exports = router;
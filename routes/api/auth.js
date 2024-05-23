const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');


router.get('/', auth, async (req, res)=>{
 try{
  const user = await User.findById(req.user.id).select('-password');
  res.json(user)
 }catch(err){
  console.error(err.message);
  res.status(500).send('Server error')
 }
});

router.post('/', [
 check('email', 'Please include a valid emial address').isEmail(),
 check('password', 'Ppassword is required').exists()
],
async (req, res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
  return res.status(400).json({errors: error.array()});
 }
 const{email, password} = req.body;
try{

 // see if user exists
 let user = await User.findOne({email});
 if(!user){
  return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
 }
 const isMatch = await bcrypt.compare(password, user.password);
 if(!isMatch){
  return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
 }
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
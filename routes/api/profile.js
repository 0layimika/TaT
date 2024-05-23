const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const { errorMessages } = require('vue/compiler-sfc');
const request = require('request')
const config = require('config')
// @route GET api/profile/me
//@desc Test route
//@access Private

router.get('/me', auth, async (req, res)=>{
 try{
  const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
  if(!profile){
   return res.status(400).json({msg: 'Profile not available'})
  }
  res.json(profile);
 }catch(err){
  console.error(err.message);
  res.status(500).send('server error')
 }
});


router.post('/',[auth,[check('status', 'status is required').not().isEmpty(),
check('skills', 'Skills is required').not().isEmpty()] ],async (req, res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
  return res.status(400).json({errors: errors.array()});
 }

 const {
  company,
  website,
  location,
  bio,
  status,
  githubusername,
  skills,
  youtube,
  facebook,
  twitter,
  instagram,
  linkedin
 } = req.body;
 //Build profile object

 const profileFields = {};
 profileFields.user = req.user.id;
 if(company) profileFields.company = company;
 if(website) profileFields.website = website;
 if(location) profileFields.location = location;
 if(bio) profileFields.bio = bio;
 if(status) profileFields.status = status;
 if(githubusername) profileFields.githubusername = githubusername;
 if(skills) {
  profileFields. skills = skills.split(',').map(skill => skill.trim());
 }
 //build social objects
 profileFields.social = {}
 if(youtube) profileFields.social.youtube = youtube;
 if(twitter) profileFields.social.twitter = twitter;
 if(facebook) profileFields.social.facebook = facebook;
 if(linkedin) profileFields.social.linkedin = linkedin;
 if(instagram) profileFields.social.instagram = instagram;

 try{
  let profile = await Profile.findOne({user: req.user.id});
  if(profile){
   //update
   profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set:profileFields},{new:true});

   return res.json(profile); 
  }

  //create
  profile = new Profile(profileFields);
  await profile.save();
  return res.json(profile);
 }catch(err){
  console.error(err.message);
  res.status(500).send("server error")

 }

});

//Get all profiles
router.get('/',async (req, res)=>{
 try {
  const profiles = await Profile.find().populate('user',['name', 'avatar']);
  res.json(profiles);
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
 }
})

//Get by profile user ID
router.get('/user/:user_id',async (req, res)=>{
 try {
  const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name', 'avatar']);
  if(!profile){
   return res.status(400).json({msg:"Profile not found"});
  }
  res.json(profile);
 } catch (err) {
  console.error(err.message);
  if(err.kind == 'ObjectId'){
   return res.status(400).json({msg:"Profile not found"});
  }
  res.status(500).send('Server error');
 }
})

//Delete profile, user and posts
router.delete('/',auth, async (req, res)=>{
 try {
  await Profile.findOneAndDelete({user: req.user.id});

  await User.findOneAndDelete({_id: req.user.id});

  res.json({msg: 'User deleted'});
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
 }
})

//Add profile experience
router.put('/experience', [auth, [
 check('title', 'Title is required').not().isEmpty(),
 check('company', 'Comapny is required').not().isEmpty(),
 check('from', ' From date is required').not().isEmpty()
]], async (req, res)=>{
 const errors = validationResult(req);
 if(!errors.isEmpty()){
  return res.status(400).json({errors: errors.array()})
 }
 const {
  title,
  company,
  location,
  from,
  to,
  current,
  description
 } = req.body;

 const newExp = {
  title, company, location, from, to, current, description
 }

 try {
  const profile = await Profile.findOne({user: req.user.id});
  profile.experience.unshift(newExp);

  await profile.save()

  res.json(profile)
 } catch (err) {
  console.error(err.message)
  res.status(500).send('Server Error')
 }

})
//Delete profile experience
router.delete('/experience/:exp_id', auth, async (req, res)=>{
 try {
  const profile = await Profile.findOne({user: req.user.id})

  const remove_index = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

  profile.experience.splice(remove_index, 1);

  await profile.save()

  res.json(profile)
 } catch (err) {
  console.error(err.message)
  res.status(500).send('server error')
 }
})

//Add profile education
router.put('/education', [auth, [
 check("school", "school must be present").not().isEmpty(),
 check("degree", "degree must be present").not().isEmpty(),
 check("fieldofstudy", "fieldofstudy must be present").not().isEmpty(),
 check("from", "from date must be present").not().isEmpty()
]], async(req, res)=>{
 const errors = validationResult(req);
 if(!errors.isEmpty()){
  return res.status(400).json({errors: errors.array()})
 }
 const {
  school,
  degree,
  fieldofstudy,
  from,
  to,
  current,
  description
 } = req.body;

 const newEdu = {
  school, degree, fieldofstudy, from, to, current, description
 }
 try {
  const profile = await Profile.findOne({user:req.user.id})
  profile.education.unshift(newEdu)

  await profile.save()
  res.json(profile)
 } catch (err) {
  console.error(err.message)
  res.status(500).send("server error")
  
 }
})

//Delete education
router.delete('/education/:edu_id', auth, async (req, res)=>{
 try {
  const profile = await Profile.findOne({user: req.user.id})

  const remove_index = profile.education.map(item => item.id).indexOf(req.params.edu_id)

  profile.education.splice(remove_index, 1);

  await profile.save()

  res.json(profile)
 } catch (err) {
  console.error(err.message)
  res.status(500).send('server error')
 }
})

router.get('/github/:username', async (req, res)=>{
 try {
  const options ={
   uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('clientId')}&client_secret=${config.get('clientSecret')}`,
   method: 'GET',
   headers: {'user-agent': 'node.js'}
  }

  request(options, (error, response, body)=>{
   if(error) console.error(error)
   if(response.statusCode !== 200){
    return res.status(404).json({msg: "no Guthub  profile found"})
   }

   res.json(JSON.parse(body))
  })
 } catch (err) {
  console.error(err.message)
  res.status(500).send("Server error")
 }
})

module.exports = router;
var express = require('express');
var router = express.Router();
var User=require("../models/user")
var crypto =require('crypto')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json('api running')

});

router.get('/users/get', function(req, res, next) {
  User.find({},(err,foundall)=>
  {
    if (err) {
      res.json(err)
    }
    else{
      res.json(foundall)
    }
  })
});

router.post('/signup',(req,res)=>
{User.findOne({username:req.body.username},(err,found_user)=>
{
  if (err) {
    res.json(err)
  } else if (found_user.username!=null){
    res.json('please login youve already registered')
  }
  else
  {
    var user1 =
    {
      username:req.body.username,
      password:crypto.createHash('md5').update(req.body.password).digest('hex'),
      tasks:
      [
  
      ]
    }
    User.create(user1,(err,created_user)=>
    {
      if (err) {
        res.json(err)
      } else {
        res.redirect("/"+created_user._id+"/get")
      }
    })
  }
})

router.post("/login",(req,res)=>
{
 
  User.findOne({username:req.body.username},(err,found_user)=>
  {
    if (err) {
      res.json(err)
    } else {
      if(crypto.createHash('md5').update(req.body.password).digest('hex')==found_user.password)
      {
        res.redirect("/"+created_user._id+"/get")
      }
      else
      {
        res.json("incorrect password");
      }
    }
  })
})

})
router.get("/:id/get",(req,res)=>
{
User.findById(req.params.id,(err,found_user)=>
{
  if (err) {
    res.json(err)
  } else {
    res.json(found_user)
  }
})
})
router.get("/:id/add",(req,res)=>
{
  var task=req.query
  User.findByIdAndUpdate(req.params.id,{$push:{tasks:task}},(err,found_user)=>
  {
    if (err) {
      res.json(err)
    } else {
      res.redirect("/"+req.params.id+"/get")
    }
  })
})

router.get("/:id/delete",(req,res)=>
{
  var pos=req.query.pos
  User.findByIdAndUpdate(req.params.id,{$pull:{tasks:{num:pos}}},(err,found_user)=>
  {
    if (err) {
      res.json(err)
    } else {
      res.redirect("/"+req.params.id+"/get")
    }
  })
})

module.exports = router;

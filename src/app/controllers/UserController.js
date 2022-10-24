const Users = require('../models/Users');
const { response } = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bcrypt = require("bcrypt");
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');


const UserController = {

    //GET
    login(req,res,next){    //form dang nhap
        res.render('users/login');
    },
    //POST
    confirmLogin(req,res,next){     //check dang nhap
        var username = req.body.username;
        var password = req.body.password;
            Users.findOne({
                username : username, 
                password : password,
            })
            .then(data=>{
                if(data){
                    var token = jwt.sign({_id: data._id},'mk')
                    //return res.redirect('/')
                    
                    return res.json({
                        message: 'thanh cong',
                        token :token
                        
                    })
                  
                }else{
                    res.redirect('/users/login')
                }
            })
            .catch(error=>{
                return res.redirect('/users/login')
            })
        },                  
    private(req,res,next){  // da dang nhap + redirect
        try{
            req.cookies.token = req.params.token
            var token = req.cookies.token
            console.log("token ne",token)

            var ketqua = jwt.verify(token,'mk')
            if(ketqua){
                res.json('wel come ')
            }
        }catch(error){
            return res.json('ban can phai dang nhap')
        }
    },
    // GET 
    register :async(req,res,next)=>{
        res.render('users/register');
    },

    //POST 
    registerUser: async (req, res) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(req.body.password, salt);
    
          //Create new user
          const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            sdt: req.body.sdt,
            hoTen: req.body.hoTen,
            quyen : 'khach',
            password: hashed,
          });
    
          //Save user to DB
          const user = await newUser.save();
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      },
      getAllUsers: async (req, res) => {
        try {
          const user = await User.find();
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      },
    
      //DELETE A USER
      deleteUser: async (req, res) => {
        try {
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User deleted");
        } catch (err) {
          res.status(500).json(err);
        }
      },
      storedUsers(req,res,next){
        Users.find()
            .then((users)=>{
                res.render('users/storedUsers',{
                    users : multipleMongooseToObject(users),

                }); 
            })
            .catch(next); 
    },        //[GET]
    edit(req,res,next){
        Users.findById(req.params.id)         
            .then(users=>res.render('users/editUser',{
                    users : mongooseToObject(users)

                })) 
            .catch(next);                    
    },
    //[PUT]
    update(req,res,next){
        Users.updateOne({_id : req.params.id},req.body)
            .then(()=>res.redirect('/users/storedUsers'))
            .catch(next);
    },
    delete(req,res,next){
        Users.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    }
}
module.exports = UserController;
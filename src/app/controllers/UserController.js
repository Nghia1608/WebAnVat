const Users = require('../models/Users');
const { response } = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bcrypt = require("bcrypt");
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');


const UserController = {

    //GET
    login(req,res,next){    //form dang nhap
        res.render('/users/login');
    },
    //POST
    confirmLogin :async(req,res,next)=>{     //check dang nhap
        const user = await Users.findOne({ username: req.body.username });
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!user || !validPassword){
            res.redirect('/users/login');
        }
        if (user && validPassword) {
            //Generate access token
            const accessToken = AuthController.generateAccessToken(user);
            //Generate refresh token
            const refreshToken = AuthController.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            //STORE REFRESH TOKEN IN COOKIE
            res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
            });
            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken, refreshToken });
        }
        },                  
    // GET 
    register :async(req,res,next)=>{
        res.render('/users/register');
    },

    //POST 
    registerUser: async (req, res) => {
        const salt = await bcrypt.genSaltSync(10);
        const hashed = await bcrypt.hashSync(req.body.password.toString(), salt);

        const formData = req.body;
        const user = new Users(formData);


        user.password=  hashed,
        user.quyen = 'Khach';

        user.save()
            .then(()=>{
                res.redirect('/users/login');
            })
            .catch(error=>{
            })


      },
      storedUsers(req,res,next){
        Users.find()
            .then((users)=>{
                res.render('/users/storedUsers',{
                    users : multipleMongooseToObject(users),

                }); 
            })
            .catch(next); 
    },        //[GET]
    edit(req,res,next){
        
        Users.findById(req.params.id)         
            .then(users=>res.render('/users/editUser',{
                    users : mongooseToObject(users)

                })) 
            .catch(next);                    
    },
    //[PUT]
    update : async (req,res,next)=>{
        const salt = await bcrypt.genSaltSync(10);
        const hashed = await bcrypt.hashSync(req.body.password.toString(), salt);

        req.body.password = hashed;

        //luu thông tin từ form
        
        Users.updateOne({_id : req.params.id},req.body)
            .then(()=>{
                res.redirect('/users/storedUsers')
            })
            .catch(next);
    },
    delete(req,res,next){
        Users.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    }
}
module.exports = UserController;
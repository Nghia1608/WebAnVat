const Users = require('../models/Users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require('express');
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');

let refreshTokens = [];

const AuthController = {
  //REGISTER
  login(req,res,next){    //form dang nhap
    res.render('users/login');
},
//POST
confirmLogin :async(req,res,next)=>{     //check dang nhap
    const user = await Users.findOne({ username: req.body.username });
    if(!user){
      res.redirect('/auth/login');
    }else{
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if(!user || !validPassword){
        res.redirect('/auth/login');
    }
    if (user && validPassword) {
        //Generate access token
        if(user.trangThai == "Đang hoạt động"){
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
          res.redirect('/');
        }else{
          res.send("Tai khoan da bi khoa")
        }

    }
    }
    
    },                  
// GET 
register :async(req,res,next)=>{
    res.render('users/register');
},

//POST 
registerUser: async (req, res) => {
    const salt = await bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync(req.body.password.toString(), salt);

    const formData = req.body;
    const user = new Users(formData);


    user.password=  hashed,
    user.quyen = 'Khach';
    user.trangThai = "Đang hoạt động";
    user.save()
        .then(()=>{
            res.redirect('/auth/login');

        })
        .catch(error=>{
          res.send(error)
        })


  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        quyen: user.quyen,
        username : user.username,
        hoTen : user.hoTen,
        sdt : user.sdt,
        diaChi : user.diaChi
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        quyen: user.quyen,
        username : user.username,
        hoTen : user.hoTen,
        sdt : user.sdt,
        diaChi : user.diaChi

      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  
  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = AuthController.generateAccessToken(user);
      const newRefreshToken = AuthController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  //LOG OUT
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.redirect('/auth/login');

  },
};

module.exports = AuthController;
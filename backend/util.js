import config from './config.js'
import jwt from "jsonwebtoken"

const getToken = (user) => {
    console.log("user == " +user)
    console.log("user._id ===" + user[0].id)
    console.log("user.name ==  " + user[0].name)
    console.log("user.name ==  " + user[0].name)
    console.log("user.email ==  " +user[0].email)
    console.log("user.isAdmin == " + user[0].isAdmin)
    // return jwt.sign({
    //   _id: user[0].id,
    //   name: user[0].name,
    //   email: user[0].email,
    //   isAdmin: user[0].isAdmin
    // }, config.JWT_SECRET, {
    //     expiresIn: "1m"
    // })

    return jwt.sign({
          _id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      isAdmin: user[0].isAdmin
    }, config.JWT_SECRET, {
        expiresIn: '1m'
    }
    )
}

const getCompanyToken = (company) => {
    return jwt.sign({
        _id: company[0]._id,
        password: company[0].password,
        isAdmin: company[0].isAdmin
    }, config.JWT_SECRET, {
expiresIn: "48h"
    })
    

}


const getAdminToken = (admin) => {

    console.log(admin)
    return jwt.sign({

       password: admin.password
    }, config.JWT_SECRET, {
expiresIn: "1h"
    })
    

}


const getSolePersonToken = (solePerson) => {
    return jwt.sign({
        _id: solePerson._id,
        password: solePerson.password,
        isAdmin: solePerson.isAdmin
    }, config.JWT_SECRET, {
expiresIn: "48h"
    })
    

}





const isAuth = (req, res, next) => {
    const token = req.header.autherization;
    if(token) {
        const onlyToken = token.slice(7, token.length);
        jwt.verify(onlyToken, config.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({msg: "Invalid Token"})
            }
            req.user = token;
            next();
            return;
        });
    }
    return res.status(401).send({msg: "Token is not supplied"})
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
      return next();
  } 
  return res.status(401).send({msg: "Admin Token is not valid"})

}


const getCompanyPasswordToken = (company) => {
    return jwt.sign({
        _id: company[0]._id,
        password: company[0].password,
        isAdmin: company[0].isAdmin
    }, config.JWT_SECRET, {
expiresIn: "10s",
    })
    

}


export {
    getToken, isAuth, isAdmin, getCompanyToken, getSolePersonToken, getAdminToken, getCompanyPasswordToken
}
import express from 'express';
import data from './data';
import mysql from 'mysql';
import {getToken, getCompanyToken, getSolePersonToken, getAdminToken, getCompanyPasswordToken} from './util'
import dotenv from 'dotenv'
import config from './config'
import bcrypt from "bcrypt"
import cors from 'cors';
import randomstring from 'randomstring'
import nodemailer from 'nodemailer'
import axios from 'axios'

// import config from './config.js'





dotenv.config();




const saltRounds = 10;

import bodyParser from 'body-parser'
// import e from 'express';

const app = express();


const smtpSetting = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth:{
      user: "vitamin88.com@gmail.com",
      pass: "vitavita1101"
  }
};



app.use(bodyParser.json({parameterLimit: 100000, limit:'50mb',extended: true }));
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit:'50mb',extended: true }));
app.use(cors({ origin: true, credentials: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'fuck',
    multipleStatements: true
  });
  connection.connect((err) => {
    if (err) {throw err}
    else {
      console.log('Connected!');
      // res.send({ 
      //   _id: signinUser.id,
      //   name: signinUser.name,
      //   email: signinUser.email, password,
      //   isAdmin: signinUser.isAdmin, 
      //   token: getToken()
      // })
    }
    
  });
console.log(connection)

//   app.post("/creatuser", function(req, res) {
//       const date = new Date();
//       console.log(date)
//       connection.query("INSERT INTO users (name,email,password,created_at) VALUES ("+ "'" + req.body.name + "'" + "," + "'" +  req.body.email + "'" + "," + "'" + req.body.password + "'" + "," + req.body.data + ")"),
//       function(error, results, fields) {
//           if(error) throw error;
//         console.log(JSON.stringify(results.insertId));
          
          
//       }





const {Translate} = require('@google-cloud/translate').v2;
const project_id = "test-for-mingle"
const api_key = "AIzaSyB1AuUb8Wnssjqcd1Ekq5YZbVl7HTxGQGY"

// Your credentials

// const CREDENTIALS = JSON.parse(config.CREDENTIALS);
// Configuration for the client
const translate = new Translate({
    // credentials: CREDENTIALS,
    projectId: project_id,
    key: api_key
});

const detectLanguage = async (text) => {

    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
}

detectLanguage('こんにちは')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(error);
    });

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

translateText('こんにちは', 'zh-CN')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });












////ちゃうかまずメールでフロント飛ばしてからかな？
////どっちでもできるか



////まって最初はメールから直接アップデートしようかとおもたっけどこのやり方だとCookie保存できないからやり直そう
/////一回frontendに遷移させてそこでUsesatetでバックエンドひっぱてきてからCookieに保存

app.post("/valify", async (req, res) => {
  console.log(req.body.data)
  console.log(req.body.data.varify)

  function getUser(secretToken, callback) {
    connection.query("SELECT * FROM USERS WHERE secretPass = ?", [secretToken], function(err, results){
      if (err)
      callback(err,null);
      else
      callback(null,results)
    });
    }

    var newUser = {}


    

    


connection.query("update USERS SET isValify ='1' WHERE secretPass = '" + req.body.data.varify + "';", function(err, results) {
  console.log("update fet called")
  if (err) {
    console.log(err)
  } else {
  
    getUser(req.body.data.varify, function(err, results) {
      if (err) {
        console.log(err)
      } else {
         newUser = results
console.log("newUser will console")
         console.log(newUser)
console.log("newUser get consoled")

         if (newUser) {
          res.send({
            _id: newUser[0].id,
            name: newUser[0].name,
            email: newUser[0].email,
            isAdmin: newUser[0].isAdmin,
            isValify: newUser[0].isValify,
            token: getToken(newUser)
        
          })
         } else {
          res.status(401).send({msg:"fail for reegister new user"})
        }


      }
    })
  

    // res.redirect("http://localhost:3000/signin")
  }
})

})



app.post("/user/remail", async (req, res) => {


  function getSigninUser(email, callback) {
    connection.query("SELECT * FROM USERS WHERE email = ?", [email], function(err, results){
      if (err)
      callback(err,null);
      else
      callback(null,results)
    });
    }
  
    var signinUser = {}
    var secretToken = ""
    var url = ""

    getSigninUser(req.body.data.email,function(err,data) {
      if (err) {
        res.send({message: 'このメールアドレスは登録されていません'});
      } else {
        signinUser = data
        console.log("result from db is :" + data)
        console.log(signinUser)

        secretToken = signinUser[0].secretPass

        url = "http://localhost:3000/valify/user/" + secretToken
        
      if (signinUser[0].isValify === 0) {
        
        let transporter = nodemailer.createTransport(smtpSetting);

      
      let mailOptions = {
          from: 'kaihatsu@mingle.co.jp',
          to: email, 
          subject: "VITAmin メール再認証", // Subject line
          text: "メールアドレスの再認証を行います", // plain text body
          html: "<h3>下記のURLをクリックしてアカウント登録が完了します</h3><br/><a href=" + url + ">" + url +"</p>", // html body
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error.message);
          }
          console.log('success');
      });
      




      } else {
        res.send({message: '既にメール認証が完了しています'});
      }
      }
    })

})





app.post('/api/users/signup', async (req, res, next) => {

  
  console.log(req.body.data.password)
  console.log(req.body.data.email)

 
  const secretToken = randomstring.generate();
  const zeroForisValify = "0"

  const url = "https://vitamin88.com//valify/user/" + secretToken

  function insertNewUser (name, email, password, date, callback) {
   
    bcrypt.hash(password, saltRounds, function(err, hash) {



      
      connection.query("insert into users(name,email,password,created_at,secretPass, isValify) values (?, ?, ?, ?, ?, ?);", [name, email, hash, date, secretToken, zeroForisValify], function (err, results) {
        if (err)
        callback (err);
        else {

          let transporter = nodemailer.createTransport(smtpSetting);
        
        let mailOptions = {
            from: 'kaihatsu@mingle.co.jp',
            to: email, 
            subject: "VITAmin メール認証", // Subject line
            text: "アカウント登録ありがとうございます", // plain text body
            html: "<h3>下記のURLをクリックしてアカウント登録が完了します</h3><br/><a href=" + url + ">" + url +"</p>", // html body
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
        });
        



          ///////

          
    
          
    
        



       
        callback(null, results)
        }
      })
      


  });

  
    
  }
  

  function getUser(email, callback) {
    connection.query("SELECT * FROM USERS WHERE email = ? ", [email], function(err, results){
      if (err)
      callback(err,null);
      else
      callback(null,results)
    });
    }


  

  var newUser = {}

          
  

  insertNewUser(req.body.data.name, req.body.data.email, req.body.data.password, req.body.data.date, function(err, results) {
    if (err) {
      console.log(err)
    } else {
      getUser(req.body.data.email,  function(err,data) {

        if (err) {
          console.log(err)
        } else {
         
          newUser = data
    
          console.log(newUser)


          if(newUser){
            res.send({
              _id: newUser[0].id,
              name: newUser[0].name,
              email: newUser[0].email,
              isAdmin: newUser[0].isAdmin,
              isValify: newUser[0].isValify,
              token: getToken(newUser)
          
            })
            } else {
              res.status(401).send({msg:"fail for reegister new user"})
            }
            console.log("testId:" + newUser[0].id)
    
        }


      })
    }
  })

  // insertNewUser(req.body.data.name, req.body.data.email, req.body.data.password, req.body.data.date, function(err, results) {
  //   if (err) {
  //     console.log(err)s
  //   } else {
      
  //     if (newUser) {

  //       res.send({
  //         _id: newUser[0].id,
  //         name: newUser[0].name,
  //         email: newUser[0].email,
  //         isAdmin: newUser[0].isAdmin,
  //         token: getToken(newUser)
      
  //       })
  //       } else {
  //         res.status(401).send({msg:"faild to register user"})
  //       }
  //       console.log("testId:" + newUser[0].id)
      

      
  //   }
  // })


  
  
  
  // const userInfo = connection.query("SELECT * FROM users " + "'" + req.body.email + "';"  ) 
  // const user = userInfo
      
  })





app.post("/api/users/signin", async (req, res) => {

  console.log("hey" +req.body.data.email)
  console.log("hey" +req.body.data.password)

  function getSigninUser(email, callback) {
  connection.query("SELECT * FROM USERS WHERE email = ?", [email], function(err, results){
    if (err)
    callback(err,null);
    else
    callback(null,results)
  });
  }

  var signinUser = {}

  

     getSigninUser(req.body.data.email,function(err,data){
        if (err) {
          console.log(err)
        } else {
         
          signinUser = data
          console.log("result from db is :" +data)
    
          console.log(signinUser)
        
          console.log("email:" + req.body.data.email)
          console.log("password:" + req.body.data.password)
          signinUser = data

       
            bcrypt.compare(req.body.data.password, signinUser[0].password, function(err, result) {
              if (result === false) {
                console.log("password mismatch")
              } else if (result === true) {
      
                if(signinUser){
                  console.log("siginin User Test ==  " + signinUser)
                  console.log("Signin user[0] test ===  " + signinUser[0])
                  res.send({
                    test: signinUser,
                    _id: signinUser[0].id,
                    name: signinUser[0].name,
                    email: signinUser[0].email,
                    isAdmin: signinUser[0].isAdmin,
                    isValify: signinUser[0].isValify,
                    token: getToken(signinUser)
                
                  })
                  } else {
                    res.status(401).send({msg:"invalid Email or Password"})
                  } 
      
                
                  console.log("testId:" + signinUser[0].id)
          
      
              }
      
              });
          
          
          
         
         
        }
      })
    
      
    })
  

  

//   getSigninUser(req.body.data.email, req.body.data.password, function(err,data){
//     if (err) {
//       console.log(err)
//     } else {
     
//       signinUser = data
//       console.log("result from db is :",data)

//       console.log(signinUser)
    
//       console.log("email:" + req.body.data.email)
//       console.log("password:" + req.body.data.password)
//       signinUser = data
      


//       if(signinUser){
//         res.send({
//           _id: signinUser[0].id,
//           name: signinUser[0].name,
//           email: signinUser[0].email,
//           isAdmin: signinUser[0].isAdmin,
//           token: getToken(signinUser)
      
//         })
//         } else {
//           res.status(401).send({msg:"invalid Email or Password"})
//         }
//         console.log("testId:" + signinUser[0].id)

//     }
//   })

  
// })  


////////////////company signin 開始////////////////////////////////


app.post("/api/company/signin", async (req, res) => {

  
  console.log("hey" +req.body.data.password)
  console.log(req.body.data.id)
  console.log("company sinin")

  function getSigninUser(companyId, callback) {
  connection.query("SELECT * FROM company WHERE id = ?", [companyId], function(err, results){
    if (err)
    callback(err,null);
    else
    callback(null,results)
  });
  }

  var adminComapny = {}

  getSigninUser(req.body.data.id, function(err,data){
    if (err) {
      console.log(err)
    } else {
        if (data.length < 1){
	    data = [{"password": ""}];
	}
	bcrypt.compare(req.body.data.password, data[0].password, function(err, result) {
        if (result === true) {

          adminComapny = data
          console.log("result from db is :",data)
    
          console.log(adminComapny)
          console.log(adminComapny[0].password)
          
          console.log("password:" + req.body.data.password)
          adminComapny = data
          
    
    
          if(adminComapny){
            res.send({
              _id: adminComapny[0].id,
              
              password: adminComapny[0].password,
              isAdmin: adminComapny[0].isAdmin,
              token: getCompanyToken(adminComapny)
          
            })
            } else {
              res.status(401).send({msg:"invalid Email or Password"})
            }

        } else {
          res.status(401).send({msg:"invalid ID or Password"})

        }
      })
     
      
        

    }
  })

  
})  


//////////////// company signin 終了 /////////////////////////


//////////////// admin signin 終了 /////////////////////////


app.post("/api/admin/signin", async (req, res) => {
  console.log(req.body.data)
  console.log("process.env ==  " + config.ADMIN_PASSWORD) 

var signinAdmin = {}

if (req.body.data.password === config.ADMIN_PASSWORD) {
  signinAdmin = req.body.data
  if (signinAdmin) {
    console.log("res.send for creating adminInfo get called")
    res.send({
      password: req.body.data.password,
      token: getAdminToken(signinAdmin)
    })
  }
  else {
    res.status(401).send({msg:"invalid Email or Password"})
  }
} 

})


//////////////// admin signin 終了 /////////////////////////



//////////////// admin add company 開始 /////////////////////////


app.post("/api/admin/add/company", async (req, res, next) => {
  
function insertNewCompany (password, date, callback) {

  bcrypt.hash(password, saltRounds, function(err, hash) {

    connection.query("insert into company (password,created_at,isAdmin) values (?, ?, ?);", [hash, date, 0], function(err, results) {
      if (err) 
      callback (err);
      else {
        callback (null, results)
      }
    })

  })
}
insertNewCompany(req.body.data.password, req.body.data.date, function(err, results) {
  console.log("insertNewCompany get called")
  if (err) {
    console.log(err);
  } else {
    console.log(results)
    res.status(200).send({msg: "success!"})

  }
})


})


////////////////  admin add company 終了 /////////////////////////


////////////////  admin add soleperson 開始 /////////////////////////

app.post("/api/admin/add/soleperson", async (req, res) => {
  
  function insertNewSolePerson (password, date, callback) {
  
    bcrypt.hash(password, saltRounds, function(err, hash) {
  
      connection.query("insert into sole_person (password,created_at,isAdmin) values (?, ?, ?);", [hash, date, 0], function(err, results) {
        if (err) 
        callback (err);
        else {
          callback (null, results)
        }
      })
  
    })
  }
  insertNewSolePerson(req.body.data.password, req.body.data.date, function(err, results) {
    console.log("insertNewSolePerson get called")
    if (err) {
      console.log(err);
    } else {
      console.log(results)
      res.status(200).send({msg: "success!"})
  
    }
  })
  
  
  })
  


////////////////  admin add soleperson 終了 /////////////////////////



////////////////soleperson signin 開始////////////////////////////////

/// new////////////////////////////////

app.post("/api/soleperson/signin", async (req, res) => {

  
  console.log("hey" +req.body.data.password)
  console.log(req.body.data.id)

  function getSigninUser(solePersonId, callback) {
  connection.query("SELECT * FROM sole_person WHERE id = ?", [solePersonId], function(err, results){
    if (err)
    callback(err,null);
    else
    callback(null,results)
  });
  }

  var adminSolePerson= {}

  getSigninUser(req.body.data.id, function(err,data){
    if (err) {
      console.log(err)
    } else {

      bcrypt.compare(req.body.data.password, data[0].password, function(err, result) {
        if (result === true) {

          adminSolePerson = data
          console.log("result from db is :",data)
    
          console.log(adminSolePerson)
          console.log(adminSolePerson[0].password)
          
          console.log("password:" + req.body.data.password)
          adminSolePerson = data
          
    
    
          if(adminSolePerson){
            res.send({
              _id: adminSolePerson[0].id,
              
              password: adminSolePerson[0].password,
              isAdmin: adminSolePerson[0].isAdmin,
              token: getSolePersonToken(adminSolePerson)
          
            })
            } else {
              res.status(401).send({msg:"invalid Email or Password"})
            }

        } else {
          res.status(401).send({msg:"invalid ID or Password"})

        }
      })
     
      
        

    }
  })

  
})  




/// new  ///







app.post("/api/soleperson/signin", async (req, res) => {

  
  console.log("sole perosn password:  " +req.body.data.password)

  function getSigninSolePerson(password, callback) {
  connection.query("SELECT * FROM sole_person WHERE password = ?", [password], function(err, results){
    if (err)
    callback(err,null);
    else
    callback(null,results)
  });
  }

  var adminSolePerson = {}

  getSigninSolePerson(req.body.data.password, function(err,data){
    if (err) {
      console.log(err)
    } else {
     
      adminSolePerson = data
      console.log("result from db is :",data)

      console.log(adminSolePerson)
      console.log(adminSolePerson[0].id)
      
      console.log("password:" + req.body.data.password)
      adminSolePerson = data
      


      if(adminSolePerson){
        res.send({
          _id: adminSolePerson[0].id,
          
          password: adminSolePerson[0].password,
          isAdmin: adminSolePerson[0].isAdmin,
          token: getSolePersonToken(adminSolePerson)
      
        })
        } else {
          res.status(401).send({msg:"invalid Email or Password"})
        }
        console.log("testId:" + adminSolePerson[0].id)

    }
  })

  
})  


//////////////// soleperson signin 終了 /////////////////////////











//会社の人登録

app.post("/api/company/register/person", async (req, res, next) => {
  console.log(req.body.data)


  

  /////まずcompanyIdはuelからわかって入ルカら3つのあたいを代入
  
  

 
    connection.query("insert into company_ceo(company_id,name,career,voice) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.ceoName + "'" + "," + "'" + req.body.data.ceoCareer + "'" + "," + "'" + req.body.data.ceoVoice + "'" + ");", function (error, results, fields) {
      if (error) throw error;
      else {
       
        console.log("ceo insert :" + results)
      }
     
    } )

    connection.query("insert into company_charge_person(company_id,name,career,voice) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.chargePersonName + "'" + "," + "'" + req.body.data.chargePersonCareer + "'" + "," + "'" + req.body.data.chargePersonVoice + "'" + ");", function (error, results, fields) {
      if (error) throw error;
      else {
      
        console.log("chargePerson insert :" + results)
      }
      
    } )

    connection.query("insert into company_extra_person(company_id,name,career,voice) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.extraPersonName + "'" + "," + "'" + req.body.data.extraPersonCareer + "'" + "," + "'" + req.body.data.extraPersonVoice + "'" + ");", function (error, results, fields) {
      if (error) throw error;
      else {
       
        console.log("extraPerson insert :" + results)
      }
      
    } )
/////まずcompanyIdはuelからわかって入ルカら3つのあたいを代入////
// function handelImage() {
//   const ceoOrder = "SELECT id FROM company_charge_person WHERE company_id =" + req.body.data.companyId;
//   const chargePersonOrder = "SELECT id FROM company_charge_person WHERE company_id =" + req.body.data.companyId
//   const extraPersonOrder = "SELECT id FROM company_extra_person WHERE company_id =" + req.body.data.companyId
// }



// const handleImage = () => {

// }


    //////上でinsertした3つのテーブルのidを取得
  
    function getCompanyCeo (companyId, callback) {
      connection.query("SELECT id FROM company_ceo WHERE company_id = ?", [companyId], function (err, results) {
        if (err) {
         callback(err,null);
         return;
        }
        else {
    callback(null, results); 
        }
      })
    }

    function getCompanyChargePerson (companyId, callback) {
      connection.query("SELECT id FROM company_charge_person WHERE company_id = ?", [companyId], function (err, results) {
        if (err) {
         callback(err,null);
         return;
        }
        else {
    callback(null, results) 
        }
      })
    }


    function getCompanyExtraPerson (comapnyId, callback) {
      connection.query("SELECT id FROM company_extra_person WHERE company_id = ?", [comapnyId], function (err, results) {
        if (err) {
         callback(err,null);
         return;
        }
        else {
    callback(null, results); 
        }
      })
    }


    ////押しっしゃ！できた！！！！！

    getCompanyCeo(req.body.data.companyId, function(err, results, fields) {
      console.log("getCompanyCeo get called")
      if (err) {
        console.log(err)
        return;
      } else {
        console.log(req.body.data.companyId)
        console.log(results[0].id)
        ceoId = results[0].id
        console.log("test" + " " + ceoId)

        if(ceoId) {
          connection.query("insert into company_ceo_image (company_ceo_id,image) values (" + "'" + ceoId + "'" + "," + "'" + req.body.data.FirstCeoPicture + "'"+ ");", function (error, results, fields) {
            if (error) throw error;
            else {
              
              console.log("ceo Images insert :" + results)

              connection.query("insert into company_ceo_image (company_ceo_id,image) values (" + "'" + ceoId + "'" + "," + "'" + req.body.data.SecondCeoPicture + "'"+ ");", function (error, results, fields) {
                if (error) throw error;
                else {
             
                  console.log("ceo image insert :" + results)
                }
                
              } )

              connection.query("insert into company_ceo_video (company_ceo_id,video_path) values (" + "'" + ceoId + "'"  + "," + "'" + req.body.data.ceoVideoPath + "'" + ");", function (err, results) {
                if (err) throw err;
                else {
                  console.log("ceo video path result ==  " + results)
                }
              })

            }
            
          } )
        } 
      }
    })




    getCompanyChargePerson(req.body.data.companyId, function(err, results, fields) {
      console.log("getCompanyChargePerson get called")
      if (err) {
        console.log(err)
        return;
      } else {
        console.log(req.body.data.companyId)
        console.log(results[0].id)
        chargePersonId = results[0].id
        console.log("test" + " " + chargePersonId)

        if(chargePersonId) {
          connection.query("insert into company_charge_person_image (company_charge_person_id,image) values (" + "'" + chargePersonId + "'" + "," + "'" + req.body.data.FirstChargePersonPicture + "'"+ ");", function (error, results, fields) {
            if (error) throw error;
            else {
              
              console.log("extra person Images insert :" + results)

              connection.query("insert into company_charge_person_image (company_charge_person_id,image) values (" + "'" + chargePersonId + "'" + "," + "'" + req.body.data.SecondChargePersonPicture + "'"+ ");", function (error, results, fields) {
                if (error) throw error;
                else {
             
                  console.log("extra person image insert :" + results)
                }
                
              } )

              connection.query("insert into company_charge_person_video (company_charge_person_id,video_path) values (" + "'" + chargePersonId + "'" + "," + "'" + req.body.data.chargePersonVideoPath + "'" + ");", function (err, results) {
                if (err) throw err;
                else {
                  console.log("charge person video path result ==  " + results)
                }
              })

            }
            
          } )
        } 
      }
    })



    getCompanyExtraPerson(req.body.data.companyId, function(err, results, fields) {
      console.log("getCompanyExtraPerson get called")
      if (err) {
        console.log(err)
        return;
      } else {
        console.log(req.body.data.companyId)
        console.log(results[0].id)
        extraPersonId = results[0].id
        console.log("test" + " " + extraPersonId)

        if(extraPersonId) {
          connection.query("insert into company_extra_person_image (company_extra_person_id,image) values (" + "'" + extraPersonId + "'" + "," + "'" + req.body.data.FirstChargePersonPicture + "'"+ ");", function (error, results, fields) {
            if (error) throw error;
            else {
              
              console.log("extra person Images insert :" + results)

              connection.query("insert into company_extra_person_image (company_extra_person_id,image) values (" + "'" + extraPersonId + "'" + "," + "'" + req.body.data.SecondChargePersonPicture + "'"+ ");", function (error, results, fields) {
                if (error) throw error;
                else {
             
                  console.log("extra person image insert :" + results)
                }
                
              } )

              connection.query("insert into company_extra_person_video (company_extra_person_id,video_path) values (" + "'" + extraPersonId + "'" + "," + "'" + req.body.data.extraPersonVideoPath + "'" + ");", function (err, results) {
                if (err) throw err;
                else {
                  console.log("charge person video path result ==  " + results)
                }
              })

            }
            
          } )
        } 
      }
    })


    
    

  

var ceoId = ""
var chargePersonId = "";
var extraPersonId = "";



// handleImage(
//   getCompanyCeo(req.body.data.companyId,
//      getCompanyChargePerson )
// )





//////上でinsertした3つのテーブルのidを取得/////////




/////こっから上で取得したIDを利用してそれぞれのimageを保存していく　これから映画見るからこの後！
// connection.query("insert into company_ceo_image (company_ceo_id,image) values (" + "'" + ceoId + "'" + "," + "'" + req.body.data.FirstCeoPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("ceo Images insert :" + results)
//   }
  
// } )


// connection.query("insert into company_ceo_image (company_ceo_id,image) values (" + "'" + ceoId + "'" + "," + "'" + req.body.data.SecondCeoPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("ceo image insert :" + results)
//   }
  
// } )



// connection.query("insert into company_charge_person_image (company_charge_person_id,image) values (" + "'" + chagrePersonId + "'" + "," + "'" + req.body.data.FirstChargePersonPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("charge person image insert :" + results)
//   }
  
// } )


// connection.query("insert into company_charge_person_image (company_charge_person_id,image) values (" + "'" + chagrePersonId + "'" + "," + "'" + req.body.data.SecondChargePersonPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("charge person image insert :" + results)
//   }
  
// } )


// connection.query("insert into company_extra_person_image (company_extra_person_id,image) values (" + "'" + extraPersonId + "'" + "," + "'" + req.body.data.FirstExtraPersonPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("extraPerson first insert :" + results)
//   }
  
// } )


// connection.query("insert into company_extra_person_image (company_extra_person_id,image) values (" + "'" + extraPersonId + "'" + "," + "'" + req.body.data.SecondExtraPersonPicture + "'"+ ");", function (error, results, fields) {
//   if (error) throw error;
//   else {
//     res.send(results)
//     console.log("extraPerson second insert :" + results)
//   }
  
// } )







})







////////////compnay information 開始/////////////

app.post("/api/company/register/information", async (req, res, next) => {
  console.log("company informayion" + req.body.data)

  console.log("company LOGO     =========  " +req.body.data.companyLogo)
  connection.query("insert into company_logo (company_id, logo) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.CompanyLogo + "'" + ");", function (err, results, fields) {
    if (err) throw err;
    else {
      console.log("Company Logo insert : " + results)
    }
  })

 


  connection.query("insert into company_information(company_id,name,adress,vision,history,service,mail) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.companyName + "'" + ","  + "'" + req.body.data.companyAdress + "'" + "," + "'" + req.body.data.companyVision + "'" + "," + "'"  + req.body.data.companyHistory + "'" + "," + "'" + req.body.data.companyService + "'" + "," + "'" + req.body.data.companyEmail  + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
     
      console.log("company_information insert :" + results)
    }
   
  } )


  connection.query("insert into company_office_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.FirstCompanyOfficeImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("FirstCompanyOfficeImage insert :" + results)
    }
    
  } )

  connection.query("insert into company_office_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.SecondCompanyOfficeImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("SecondCompanyOfficeImage insert :" + results)
    }
    
  } )

  connection.query("insert into company_factory_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.FirstCompanyFactoryImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("FirstCompanyFactoryImage insert :" + results)
    }
    
  } )

  connection.query("insert into company_factory_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.SecondCompanyFactoryImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("SecondCompanyFactoryImage insert :" + results)
    }
    
  } )


  connection.query("insert into company_factory_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.ThirdCompanyFactoryImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("ThirdCompanyFactoryImage insert :" + results)
    }
    
  } )

  connection.query("insert into company_factory_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.FourthCompanyFactoryImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("FourthCompanyFactoryImage insert :" + results)
    }
    
  } )

  connection.query("insert into company_factory_image(company_id,image) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.FifthCompanyFactoryImage + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
    
      console.log("FifthCompanyFactoryImage insert :" + results)
    }
    
  } )


})





////////////compnay information 終了/////////////






////////////compnay action 開始/////////////

app.post("/api/company/register/item", async (req, res, next) => {
  console.log(req.body.data)


 /////// 途中からcompany_itemに直接　category枠加えた 開始////////////////////////////////

  connection.query("insert into company_items(company_id,name,price,stock,explanation,category,created_at) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.companyItemName + "'" + "," + "'" + req.body.data.companyItemPrice + "'" + "," + "'" + req.body.data.companyItemStock + "'" + "," + "'" + req.body.data.companyItemExplanation + "'" + "," + "'" + req.body.data.companyItemCategory + "'" + "," + "'" + req.body.data.companyItemCreatedAt + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
     
      console.log("company_information insert :" + results)
    }
   
  } )

   /////// 途中からcompany_itemに直接　category枠加えた　終了////////////////////////////////


  function getCompanyItemsImage (itemName, callback) {
    connection.query("SELECT id FROM company_items WHERE name = ?", [itemName], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyCategory (category, callback) {
    connection.query("SELECT id FROM categories WHERE category_name = ?", [category], function (err, results) {
      if (err) {
        callback(err);
        return;
      } else {
        callback(null, results);
      }
    })
  }





  var CompanyItemId = "";
  var CompanyItemIdForCategory = "";
  var CompanyCategory = "";




  getCompanyItemsImage(req.body.data.companyItemName, function(err, results, fields) {
    console.log("getCompanyItemsImage get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(req.body.data.companyItemName)
      console.log("heyyyyyyyy   " +results)
      console.log(results[0].id)
      CompanyItemId = results[0].id
      console.log("test" + " " + CompanyItemId)

      if(CompanyItemId) {
        
        connection.query("insert into company_items_image(company_items_id,image) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.FirstCompanyItemImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FirstCompanyItemImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_items_image(company_items_id,image) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.SecondCompanyItemImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("SecondCompanyItemImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_items_image(company_items_id,image) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.ThirdCompanyItemImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("ThirdCompanyItemImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_items_image(company_items_id,image) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.FourthCompanyItemImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FourthCompanyItemImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_items_image(company_items_id,image) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.FifthCompanyItemImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FifthCompanyItemImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_items_video(company_items_id,video_path) values (" + "'" + CompanyItemId + "'" + "," + "'" + req.body.data.companyItemVideoPath + "'" + ");", function(err, results) {
          if (err) throw err;
          else {
            console.log("Insert company item video path result ==   " + results)
          }
        })
        
      } 
    }
  })






  getCompanyItemsImage(req.body.data.companyItemName, function(err, results, fields) {
    console.log("getCompanyItemsImage for relation get called") 
    if (err) {
      console.log(err)
      return;
    } else {
      console.log("result for relation get" + results)
      console.log(req.body.data.companyItemName)
      console.log(results[0].id)
      CompanyItemIdForCategory = results[0].id
      console.log("test" + " " + CompanyItemIdForCategory)

      if(CompanyItemIdForCategory) { 
         getCompanyCategory(req.body.data.companyItemCategory, function (error, results, fields) {
           if (error) {
             console.log(error);
             return;
           } else {
            console.log(req.body.data.companyItemCategory)
            console.log("result of getCompanyCAtegory ==  " + results)
            console.log(results[0].id)
            CompanyCategory = results[0].id
            console.log("test" + " " + CompanyCategory)

            console.log("CompanyCategory =" + CompanyCategory + "  CompanyItemIdForCategory  = " + CompanyItemIdForCategory)

            connection.query("insert into relation_company_items_categories(items_id,categories_id) values (" + "'" + CompanyItemIdForCategory + "'" + "," + "'" + CompanyCategory + "'" + ");", function (error, results, fields) {
              if (error) throw error;
              else {
              
                console.log("SecondCompanyItemImage insert :" + results)
              }
              
            } )

      
           }
         })
      }

     

    }
  })



  

 

})





////////////compnay action 終了/////////////





////////////compnay patent 開始/////////////

app.post("/api/company/register/patent", async (req, res, next) => {
  console.log(req.body.data)
  console.log("INSERT COMPANY PATENT get called")


  connection.query("insert into company_patent(company_id,name,explanation) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.companyPatentName + "'" + "," + "'" + req.body.data.companyPatentExplanation + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
     
      console.log("company_patent insert :" + results)
    }
   
  } )


  function getCompanyPatentImage (patentName, callback) {
    connection.query("SELECT id FROM company_patent WHERE name = ?", [patentName], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  var CompanyPatentId = ""



  getCompanyPatentImage(req.body.data.companyPatentName, function(err, results, fields) {
    console.log("getCompanyPatentImage get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(req.body.data.companyPatentName)
      
      console.log(results[0].id)
      CompanyPatentId = results[0].id
      console.log("test" + " " + CompanyPatentId)

      if(CompanyPatentId) {
        
        connection.query("insert into company_patent_image(company_patent_id,image) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.FirstCompanyPatentImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FirstCompanyPatentImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_patent_image(company_patent_id,image) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.SecondCompanyPatentImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("SecondCompanyPatentImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_patent_image(company_patent_id,image) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.ThirdCompanyPatentImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("ThirdCompanyPatentImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_patent_image(company_patent_id,image) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.FourthCompanyPatentImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FourthCompanyPatentImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_patent_image(company_patent_id,image) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.FifthCompanyPatentImage + "'" + ");", function (error, results, fields) {
          if (error) throw error;
          else {
          
            console.log("FifthCompanyPatentImage insert :" + results)
          }
          
        } )

        connection.query("insert into company_patent_video(company_patent_id,video_path) values (" + "'" + CompanyPatentId + "'" + "," + "'" + req.body.data.companyPatentVideoPath + "'" + ");", function(err, results) {
          if (err) throw err;
          else {
            console.log("insert company patent video path resault ==  " + results)
          }
        })
        
      } 
    }
  })






  

 

})





////////////compnay patent 終了/////////////



////////////get company item 開始/////////////


app.get("/api/company/item/:id",async(req,res) =>{
  console.log("getCompany get called")
  console.log(req.params.id)

  function getCompanyProduct (companyId, callback) {
    connection.query("SELECT * FROM company_items WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyProductImage (companyProductId, callback) {
    connection.query("SELECT * FROM company_items_image WHERE company_items_id = ?", [companyProductId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  

  var getCompanyProductForShowing = ""
  var getCompanyProductImageForShowing = ""



  getCompanyProduct(req.params.id, function (err, results) {
    console.log("getCompanyProduct get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      getCompanyProductForShowing = results
      if (getCompanyProductForShowing.length > 0) {
        console.log("test ===   " +getCompanyProductForShowing)
        if (err) throw err;
        
        else {
        getCompanyProductImage(getCompanyProductForShowing[0].id, function (error, results) {
            console.log("getCompanyItemsImage get called")
            if (error) {
              console.log(error)
            } else {
              console.log(results)
              getCompanyProductImageForShowing = results;
              console.log({getCompanyProductForShowing, getCompanyProductImageForShowing})
              res.send({
                test: "Hello",
                CompanyProduct: getCompanyProductForShowing,
                CompanyImage: getCompanyProductImageForShowing,
              })
            }
            
          })
        }
      } else {
        res.send({
          CompanyProduct: [],
          CompanyImage: [],
        })
      }
    }
  })

})


////////////get company item 終了/////////////

////////////get company item image image　も全部 開始/////////////



app.get("/api/company/item/modify/image/:id", async (req, res) => {
  
  console.log("getCompany get called")
  console.log(req.params.id)

  

  function getCompanyProduct (companyId, callback) {
    connection.query("SELECT * FROM company_items WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }



  function getCompanyProductImage (companyProductId, callback) {
    connection.query("SELECT * FROM company_items_image WHERE company_items_id = ?", [companyProductId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  var getCompanyProductModifyImageForShowing = ""
var getCompanyProductImageModifyImageForShowing = []
var n = 0

  getCompanyProduct(req.params.id, function (err, results) {
    console.log("getCompanyProduct get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log("Hudheu    ===   " +results)
      getCompanyProductModifyImageForShowing = results
console.log("llllllll       =====   " +getCompanyProductModifyImageForShowing.length)
getCompanyProductModifyImageForShowing.map(i => {
console.log("sss  ==  " +i.id)
  getCompanyProductImage(i.id, function (err, results) {
    console.log("this is i ==  " + i)
    if (err) {
      console.log(err);
      return;
    } else {

      console.log(results[0].id)
      console.log(results[1].id)
      console.log(results[2].id)
      console.log(results[3].id)
      console.log(results[4].id)



      
      console.log(results);

      


      
      getCompanyProductImageModifyImageForShowing.push(results[0].image);
      getCompanyProductImageModifyImageForShowing.push(results[1].image);
      getCompanyProductImageModifyImageForShowing.push(results[2].image);
      getCompanyProductImageModifyImageForShowing.push(results[3].image);
      getCompanyProductImageModifyImageForShowing.push(results[4].image);
      n = n + 5
      console.log("n ===  " + n)
      console.log("t3est ===  " +getCompanyProductImageModifyImageForShowing)
    }

    if (n === getCompanyProductModifyImageForShowing.length * 5) {
      res.send({
        CompanyProduct: getCompanyProductModifyImageForShowing,
        CompanyImage: getCompanyProductImageModifyImageForShowing
      })
    }
    
  })
  

})


  



 }

  })



})

////////////get company item　IMage も全部！！ 終了/////////////




////////////get company person 開始/////////////


app.get("/api/company/person/:id",async(req,res) =>{
  console.log("getCompany get called")
  console.log(req.params.id)

  function getCompanyCeo (companyId, callback) {
    connection.query("SELECT * FROM company_ceo WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyCeoImage (companyCeoId, callback) {
    connection.query("SELECT * FROM company_ceo_image WHERE company_ceo_id = ?", [companyCeoId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  function getCompanyCeoVideo(companyCeoId, callback) {
    connection.query("SELECT * FROM company_ceo_video WHERE company_ceo_id = ?", [companyCeoId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }




  function getCompanyChargePerson(companyId, callback) {
    connection.query("SELECT * FROM company_charge_person WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyChargePersonImage (companyChargePersonId, callback) {
    connection.query("SELECT * FROM company_charge_person_image WHERE company_charge_person_id = ?", [companyChargePersonId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }


  function getCompanyChargePersonVideo(companyChargePersonId, callback) {
    connection.query("SELECT * FROM company_charge_person_video WHERE company_charge_person_id = ?", [companyChargePersonId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }

  function getCompanyExtraPerson(companyId, callback) {
    connection.query("SELECT * FROM company_extra_person WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyExtraPersonImage (companyExtraPersonId, callback) {
    connection.query("SELECT * FROM company_extra_person_image WHERE company_extra_person_id = ?", [companyExtraPersonId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  function getCompanyExtraPersonVideo(companyExtraPersonId, callback) {
    connection.query("SELECT * FROM company_extra_person_video WHERE company_extra_person_id = ?", [companyExtraPersonId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  var getCompanyCeoForShowing = ""
  var getCompanyCeoImageForShowing = ""
  var getCompanyCeoVideoForShowing = ""
  var getCompanyChargePersonForShowing = ""
  var getCompanyChargePersonImageForShowing = ""
  var getCompanyChargePersonVideoForShowing = ""
  var getCompanyExtraPersonForShowing = ""
  var getCompanyExtraPersonImageForShowing = ""
  var getCompanyExtraPersonVideoForShowing = ""



  getCompanyCeo(req.params.id, function (err, results) {
    console.log("getCompanyCeo get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      getCompanyCeoForShowing = results
      if (getCompanyCeoForShowing.length > 0) {
        if (err) throw err;
        else {
          getCompanyCeoImage(getCompanyCeoForShowing[0].id, function (error, results) {
            console.log("getCompanyCeoImage get called")
            if (error) {
              console.log(error)
            } else {
              console.log(results)
              getCompanyCeoImageForShowing = results;
              console.log({getCompanyCeoForShowing, getCompanyCeoImageForShowing})
              getCompanyCeoVideo(getCompanyCeoForShowing[0].id, function (error, results) {
                console.log("getCompanyCeoVideo get called")
                if (error) {
                  console.log(error)
                } else {
                  console.log(results)
                  getCompanyCeoVideoForShowing = results
               
              getCompanyChargePerson(req.params.id, function (err, results){
                console.log("getCompanyChargePerson get called")
                if (err) {
                  console.log(err)
                  return;
                } else {
                  console.log(results)
                  getCompanyChargePersonForShowing = results
                  if (getCompanyChargePersonForShowing) {
                    if (err) throw err;
                    else {
                      getCompanyChargePersonImage(getCompanyChargePersonForShowing[0].id, function (error, results) {
                        console.log("getCompanyChargePersonImage get called")
                        if (error) {
                          console.log(error);
                        } else {
                          console.log(results)
                          getCompanyChargePersonImageForShowing = results;
                          
                          getCompanyChargePersonVideo(getCompanyChargePersonForShowing[0].id, function (error, results) {
                            console.log("getCompanyChargePersonVideo get called")
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(results)
                              getCompanyChargePersonVideoForShowing = results;
                           
                          getCompanyExtraPerson(req.params.id, function (err, results){
                            console.log("getCompanyExtraPerson get called")
                            if (err) {
                              console.log(err);
                              return;
                            } else {
                              console.log(results)
                              getCompanyExtraPersonForShowing = results
                              if (getCompanyExtraPersonForShowing) {
                                if (err) throw err;
                                else {
                                  getCompanyExtraPersonImage(getCompanyExtraPersonForShowing[0].id, function (error, results) {
                                    console.log("getCompanyExtraPersonImage get called")
                                    if (error) {
                                      console.log(error)
                                    } else {
                                      console.log(results)
                                      getCompanyExtraPersonImageForShowing = results;

                                      getCompanyExtraPersonVideo(getCompanyExtraPersonForShowing[0].id, function (error, results) {
                                        console.log("getCompanyExtraPersonVideo get called")
                                        if (error) {
                                          console.log(error)
                                        } else {
                                          console.log(results)
                                          getCompanyExtraPersonVideoForShowing = results
                                          res.send({
                                        CompanyCeo: getCompanyCeoForShowing,
                                        CompanyCeoImage: getCompanyCeoImageForShowing,
                                        CompanyCeoVideo: getCompanyCeoVideoForShowing,
                                        CompanyChargePerson: getCompanyChargePersonForShowing,
                                        CompanyChargePersonImage: getCompanyChargePersonImageForShowing,
                                        CompanyChargePersonVideo: getCompanyChargePersonVideoForShowing,
                                        CompanyExtraPerson: getCompanyExtraPersonForShowing,
                                        CompanyExtraPersonImage: getCompanyExtraPersonImageForShowing,
                                        CompanyExtraPersonVideo: getCompanyExtraPersonVideoForShowing
                                      })
                                        }
                                      })
                                      
                                    }
                                  })
                                }
                              }
                            }
                          })
                            }
                          })
                        }
                      })
                    }
                  }
                  
                }
              })
            }
              })
            }
            
          })
        }
      } else {
        res.send({
          CompanyCeo: [],
          CompanyCeoImage: [],
          CompanyCeoVideo: [],
          CompanyChargePerson: [],
          CompanyChargePersonImage: [],
          CompanyChargePersonVideo: [],
          CompanyExtraPerson: [],
          CompanyExtraPersonImage: [],
          CompanyExtraPersonVideo: []
        })
      }
    } 
  })

})


////////////get company person 終了/////////////

  


////////////get company patent 開始/////////////


app.get("/api/company/patent/:id",async(req,res) =>{
  console.log("getCompanyPatent get called")
  console.log(req.params.id)

  function getCompanyPatent (companyId, callback) {
    connection.query("SELECT * FROM company_patent WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyPatentImage (companyPatentId, callback) {
    connection.query("SELECT * FROM company_patent_image WHERE company_patent_id = ?", [companyPatentId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }


  var getCompanyPatentForShowing = ""
  var getCompanyPatentImageForShowing = ""



  getCompanyPatent(req.params.id, function (err, results) {
    console.log("getCompanyPatent get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      getCompanyPatentForShowing = results
      if (getCompanyPatentForShowing.length > 0) {
        if (err) throw err;
        else {
          getCompanyPatentImage(getCompanyPatentForShowing[0].id, function (error, results) {
            console.log("getCompanyPatentImage get called")
            if (error) {
              console.log(error)
            } else {
              console.log(results)
              getCompanyPatentImageForShowing = results;
              console.log({getCompanyPatentForShowing, getCompanyPatentImageForShowing})
              res.send({
                
                CompanyPatent: getCompanyPatentForShowing,
                CompanyPatentImage: getCompanyPatentImageForShowing,
              })
            }
            
          })
        }
      } else {
        res.send({
          CompanyPatent: [],
                CompanyPatentImage: [],
        })
      }
    }
  })

})


////////////get company patent 終了/////////////




////////////get company information 開始/////////////


app.get("/api/company/information/:id",async(req,res) =>{
  console.log("getCompanyInformation get called")
  console.log(req.params.id)

  function getCompanyInformation (companyId, callback) {
    connection.query("SELECT * FROM company_information WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }


  function getCompanyOfficeImage (companyId, callback) {
    connection.query("SELECT * FROM company_office_image WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  function getCompanyFactoryImage (companyId, callback) {
    connection.query("SELECT * FROM company_factory_image WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }


  function getCompanyLogo (companyId, callback) {
    connection.query("SELECT * FROM company_logo WHERE company_id = ?", [companyId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  var getCompanyInformationForShowing = ""
  var getCompanyOfficeImageForShowing = ""
  var getCompanyFactoryImageForShowing = ""
  var getCompanyLogoForShowing = ""



  



  getCompanyInformation(req.params.id, function (err, results) {
    console.log("getCompanyInformation get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      getCompanyInformationForShowing = results
      if (getCompanyInformationForShowing) {
        if (err) throw err;
        else {
          getCompanyOfficeImage(req.params.id, function (error, results) {
            console.log("getCompanyOfficeImage get called")
            if (error) {
              console.log(error)
            } else {
              console.log(results)
              getCompanyOfficeImageForShowing = results;
              if (getCompanyOfficeImageForShowing) {
                if (err) throw err;
                 else {
                  getCompanyFactoryImage(req.params.id, function (error, results) {
                    console.log("getCompanyFactoryImage get called")
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(results);
                      getCompanyFactoryImageForShowing = results
                      if (getCompanyFactoryImageForShowing) {
                        if (err) throw err;
                        else {
                          getCompanyLogo(req.params.id, function (error, results) {
                            console.log("getCompanyLogo get called")
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(results)
                              getCompanyLogoForShowing = results
                              console.log({getCompanyInformationForShowing, getCompanyOfficeImageForShowing, getCompanyFactoryImageForShowing, getCompanyLogoForShowing})
                              res.send({
                                CompanyInformation: getCompanyInformationForShowing,
                                CompanyOfficeImage: getCompanyOfficeImageForShowing,
                                CompanyFactoryImage: getCompanyFactoryImageForShowing,
                                CompanyLogo: getCompanyLogoForShowing
    
                              })
                            }
                          })
                        }
                      }
                 
                    }
    
                  })
                 }
              }
              
              
            }
            
          })
        }
      }
    }
  })

})


////////////get company information 終了/////////////


////////////insert sole person information information 開始/////////////


app.post('/api/soleperson/register/information', async function (req, res) {
  console.log(req.body.data)

connection.query("insert into sole_person_information(sole_person_id,name,connectionemail,wechat_id) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.SolePersonName + "'" + "," + "'" + req.body.data.SolePersonEmail + "'" + "," + "'" + req.body.data.SolePersonWechatId +"'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("Sole Person Information Insert : " + results)
  }
})

connection.query("insert into sole_person_first_image(sole_person_id,images) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.FirstSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("FirstSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_image(sole_person_id,image) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.FirstSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("FirstSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_image(sole_person_id,image) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.SecondSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("SecondSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_image(sole_person_id,image) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.ThirdSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("ThirdSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_image(sole_person_id,image) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.FourthSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("FourthSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_image(sole_person_id,image) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.FifthSolePersonPicture + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("FifthSolePersonPicture Insert : " + results)
  }
})

connection.query("insert into sole_person_history(sole_person_id,history) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.SolePersonHistory + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("SolePersonHistory Insert : " + results)
  }
})

function getSolePersonHistoryId (SolePersonId, callback) {
  connection.query("SELECT id FROM sole_person_history WHERE sole_person_id = ?", [SolePersonId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
     }
     else {
 callback(null, results); 
     }
  })
}

var historyId = "";


getSolePersonHistoryId (req.body.data.SolePersonId, function (err, results, fields) {
  console.log("getSolePersonHistoryId get called")
  if (err) {
    console.log(err)
    return;
  } else {
    console.log(req.body.data.SolePersonId)
    console.log(results[0].id)
    historyId = results[0].id
    console.log("historyId = " + historyId)
if (historyId) {
  connection.query("insert into sole_person_history_image (sole_person_history_id,image) values (" + "'" + historyId + "'" + "," + "'" + req.body.data.FirstSolePersonHistoryPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("First sole person image insert :" + results)
    }
  })

  connection.query("insert into sole_person_history_image (sole_person_history_id,image) values (" + "'" + historyId + "'" + "," + "'" + req.body.data.SecondSolePersonHistoryPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Second sole person image insert :" + results)
    }
  })

  connection.query("insert into sole_person_history_image (sole_person_history_id,image) values (" + "'" + historyId + "'" + "," + "'" + req.body.data.ThirdSolePersonHistoryPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Third sole person image insert :" + results)
    }
  })

  connection.query("insert into sole_person_history_image (sole_person_history_id,image) values (" + "'" + historyId + "'" + "," + "'" + req.body.data.FourthSolePersonHistoryPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Fourth sole person image insert :" + results)
    }
  })

  connection.query("insert into sole_person_history_image (sole_person_history_id,image) values (" + "'" + historyId + "'" + "," + "'" + req.body.data.FifthSolePersonHistoryPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Fifth sole person image insert :" + results)
    }
  })


}

  }
})



connection.query("insert into sole_person_vision(sole_person_id,vision) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.SolePersonVision + "'" + ");", function (error, results, fields) {
  if (error) throw error;
  else {
console.log("SolePersonVision Insert : " + results)
  }
})

function getSolePersonVisionId (solePersonId, callback) {
connection.query("SELECT id FROM sole_person_vision WHERE sole_person_id = ?", [solePersonId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
     }
     else {
 callback(null, results); 
     }
  })
}

var visionId = "";


getSolePersonVisionId (req.body.data.SolePersonId, function (err, results, fields) {
  console.log("getSolePersonVisionId get called")
  if (err) {
    console.log(err)
    return;
  } else {
    console.log(req.body.data.SolePersonId)
    console.log(results[0].id)
    visionId = results[0].id
    console.log("visionId = " + visionId)
if (visionId) {
  connection.query("insert into sole_person_vision_image (sole_person_vision_id,image) values (" + "'" + visionId + "'" + "," + "'" + req.body.data.FirstSolePersonVisionPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("First sole person image for vision insert :" + results)
    }
  })

  connection.query("insert into sole_person_vision_image (sole_person_vision_id,image) values (" + "'" + visionId + "'" + "," + "'" + req.body.data.SecondSolePersonVisionPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Second sole person image for vision insert :" + results)
    }
  })
  connection.query("insert into sole_person_vision_image (sole_person_vision_id,image) values (" + "'" + visionId + "'" + "," + "'" + req.body.data.ThirdSolePersonVisionPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Third sole person image for vision insert :" + results)
    }
  })

  connection.query("insert into sole_person_vision_image (sole_person_vision_id,image) values (" + "'" + visionId + "'" + "," + "'" + req.body.data.FourthSolePersonVisionPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Fourth sole person image for vision insert :" + results)
    }
  })

  connection.query("insert into sole_person_vision_image (sole_person_vision_id,image) values (" + "'" + visionId + "'" + "," + "'" + req.body.data.FifthSolePersonVisionPicture + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
      console.log("Fifth sole person image for vision insert :" + results)
    }
  })

}

  }
})






})




////////////insert sole person information information 終了/////////////




////////////insert sole person  item 開始/////////////



app.post('/api/soleperson/register/item', async function (req, res) {


  connection.query("insert into sole_person_items (sole_person_id,name,price,explanation) values (" + "'" + req.body.data.SolePersonId + "'" + "," + "'" + req.body.data.ItemName + "'" + "," + "'" + req.body.data.ItemPrice + "'" + "," + "'" + req.body.data.ItemExplanation + "'" + ");", function(error, results, fields) {
    if (error) throw error;
    else {
   
    }
   })

function getSolePersonItemid (ItemName, callback) {
  connection.query("SELECT id FROM sole_person_items WHERE name = ?", [ItemName], function (err, results){
    if (err) {
      callback(err,null);
    } else {
      callback(null,results)
    }
  })
}


var solePersonItemId = "";

getSolePersonItemid(req.body.data.ItemName, function (err, results, fields) {
  console.log("getSolePersonItemid get called")
  if (err) {
    console.log(err)
    return;
  } else {
    console.log(req.body.data.ItemName)
    console.log(results[0].id)
    solePersonItemId = results[0].id
    console.log("getSolePersonItemid = " +solePersonItemId)
   if (solePersonItemId) {
    connection.query("insert into sole_person_items_image (sole_person_items_id, image) values (" + "'" + solePersonItemId + "'" + "," + "'" + req.body.data.FirstItemPicture + "'" + ");", function (err, results, fields) {
if (err) throw err;
else {
  console.log("First sole person item image insert :" + results)
}
    })

    connection.query("insert into sole_person_items_image (sole_person_items_id, image) values (" + "'" + solePersonItemId + "'" + "," + "'" + req.body.data.SecondItemPicture + "'" + ");", function (err, results, fields) {
      if (err) throw err;
      else {
        console.log("Second sole person item image insert :" + results)
      }
          })

          connection.query("insert into sole_person_items_image (sole_person_items_id, image) values (" + "'" + solePersonItemId + "'" + "," + "'" + req.body.data.ThirdItemPicture + "'" + ");", function (err, results, fields) {
            if (err) throw err;
            else {
              console.log("Third sole person item image insert :" + results)
            }
                })

                connection.query("insert into sole_person_items_image (sole_person_items_id, image) values (" + "'" + solePersonItemId + "'" + "," + "'" + req.body.data.FourthItemPicture + "'" + ");", function (err, results, fields) {
                  if (err) throw err;
                  else {
                    console.log("Fourth sole person item image insert :" + results)
                  }
                      })

                      connection.query("insert into sole_person_items_image (sole_person_items_id, image) values (" + "'" + solePersonItemId + "'" + "," + "'" + req.body.data.FifthItemPicture + "'" + ");", function (err, results, fields) {
                        if (err) throw err;
                        else {
                          console.log("Fifth sole person item image insert :" + results)
                        }
                            })


  }
}
})


})


////////////insert sole person  item 終了/////////////




////////////get sole person item item 開始/////////////




app.get("/api/soleperson/item/:id",async (req, res) => {
  console.log("get sole person item get called")
  console.log(req.params.id)


  function getSolePersonProduct (solePersonid, callback) {
    connection.query("SELECT * FROM sole_person_items where sole_person_id = ?", [solePersonid], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null,results);
      }
    });
  }


function getSolePersonProductImage (solePersonProductId, callback) {
  connection.query("SELECT * FROM sole_person_items_image WHERE sole_person_items_id = ?", [solePersonProductId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}

var getSolePersonProductForShowing = "";
var getSolePersonProductImageForShowing = "";

getSolePersonProduct(req.params.id, function (err, results) {
  console.log("getSolePersonProduct get called")
  if (err) {
    console.log(err)
    return;
  } else {
    console.log(results)
    getSolePersonProductForShowing = results
if (getSolePersonProductForShowing.length > 0) {
  if (err) throw err;
  else {
    getSolePersonProductImage(getSolePersonProductForShowing[0].id, function (error, results) {
      console.log("getSolePersonProductImage get called")
      if (error) {
        console.log(error)
      } else {
        console.log(results)
        getSolePersonProductImageForShowing = results;
        console.log({getSolePersonProductForShowing, getSolePersonProductImageForShowing})
        res.send({
          SolePersonProduct: getSolePersonProductForShowing,
          SolePersonProductImage: getSolePersonProductImageForShowing
        })
      }
    })
  }
} else {
  res.send({
    SolePersonProduct: [],
    SolePersonProductImage: []
  })
}
  }
})


})



////////////get sole person item item 終了/////////////

////////////get sole person item　IMage も全部！！ 開始/////////////



app.get("/api/soleperson/item/modify/image/:id", async (req, res) => {
  
  console.log("get sole person get called")
  console.log(req.params.id)

  

  function getSolePersonProduct (solePersonId, callback) {
    connection.query("SELECT * FROM sole_person_items WHERE sole_person_id = ?", [solePersonId], function (err, results) {
      if (err) {
       callback(err,null);
       return;
      }
      else {
  callback(null, results); 
      }
    })
  }



  function getSolePersonProductImage (solePersonProductId, callback) {
    connection.query("SELECT * FROM sole_person_items_image WHERE sole_person_items_id = ?", [solePersonProductId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results);
      }
    })
  }

  var getSolePersonProductModifyImageForShowing = ""
var getSolePersonProductImageModifyImageForShowing = []
var n = 0

  getSolePersonProduct(req.params.id, function (err, results) {
    console.log("getSolePersonProduct get called")
    if (err) {
      console.log(err)
      return;
    } else {
      console.log("Hudheu    ===   " +results)
      getSolePersonProductModifyImageForShowing = results
console.log("llllllll       =====   " +getSolePersonProductModifyImageForShowing.length)
getSolePersonProductModifyImageForShowing.map(i => {
console.log("sss  ==  " +i.id)
getSolePersonProductImage(i.id, function (err, results) {
    console.log("this is i ==  " + i)
    if (err) {
      console.log(err);
      return;
    } else {

      console.log(results[0].id)
      console.log(results[1].id)
      console.log(results[2].id)
      console.log(results[3].id)
      console.log(results[4].id)



      
      console.log(results);

      


      
      getSolePersonProductImageModifyImageForShowing.push(results[0].image);
      getSolePersonProductImageModifyImageForShowing.push(results[1].image);
      getSolePersonProductImageModifyImageForShowing.push(results[2].image);
      getSolePersonProductImageModifyImageForShowing.push(results[3].image);
      getSolePersonProductImageModifyImageForShowing.push(results[4].image);
      n = n + 5
      console.log("n ===  " + n)
      
    }

    if (n === getSolePersonProductModifyImageForShowing.length * 5) {
      res.send({
        SolePersonProduct: getSolePersonProductModifyImageForShowing,
        SolePersonProductImage: getSolePersonProductImageModifyImageForShowing
      })
    }
    
  })
  

})


  



 }

  })



})

////////////get sole person item　IMage も全部！！ 終了/////////////






////////////get sole person history 開始/////////////


app.get("/api/soleperson/history/:id", async (req, res) => {
  console.log("getSolePersonHistory get called")
  console.log(req.params.id)

  function getSolePersonHistory (solePersonId, callback) {
    connection.query("SELECT * FROM sole_person_history WHERE sole_person_id = ?", [solePersonId], function (err, results) {
      if (err) {
        callback(err,null)
        return;
      } else {
        callback(null, results)
      }
    })
  }

function getSolePersonHistoryImage(SolePersonHistoryId, callback) {
  connection.query("SELECT * FROM sole_person_history_image WHERE sole_person_history_id = ?", [SolePersonHistoryId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results);
    }
  })
}

var getSolePersonHistoryForShowing = "";
var getSolePersonHistoryImageForShowing = "";


getSolePersonHistory(req.params.id, function (err, results) {
  console.log("getSolePersonHistory get calle")
  if (err) {
    console.log(err)
    return;
} else {
  console.log(results)
  getSolePersonHistoryForShowing = results
  if (getSolePersonHistoryForShowing.length > 0) {
    if (err) throw err;
    else {
      getSolePersonHistoryImage(getSolePersonHistoryForShowing[0].id, function (error, results) {
        console.log("getSolePersonHistoryImage get called")
        if (error) {
console.log(error);
        } else {
          console.log(results)
          getSolePersonHistoryImageForShowing = results;
          console.log({getSolePersonHistoryForShowing, getSolePersonHistoryImageForShowing});
          res.send({
            SolePersonHistory: getSolePersonHistoryForShowing,
            SolePersonHistoryImage: getSolePersonHistoryImageForShowing
          })
        }
      })
    }
  } else {
    res.send({
      SolePersonHistory: [],
            SolePersonHistoryImage: []
    })
  }
}
})


})


////////////get sole person history 終了/////////////



////////////get sole person information 開始/////////////


app.get("/api/soleperson/information/:id", async (req, res) => {
  console.log("getSolePersonInformation get called")
  console.log(req.params.id)

function getSolePersonInformation (solePersonId, callback) {
  connection.query("SELECT * FROM sole_person_information WHERE sole_person_id = ?", [solePersonId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}

var getSolePersonInformationForShowing = "";

getSolePersonInformation (req.params.id, function (error, results) {
  console.log("getSolePersonIn;formation get called")
  if (error) {
    console.log(error)
  } else {
    console.log(results)
    getSolePersonInformationForShowing = results;
    console.log({getSolePersonInformationForShowing})
    res.send({
      SolePersonInformation: getSolePersonInformationForShowing
    })
  }
})

})



////////////get sole person information 終了/////////////


////////////get sole person image 開始/////////////


app.get("/api/soleperson/image/:id",async (req, res) => {
  console.log("get sole person image get called")
  console.log(req.params.id)

  function getSolePersonImage (solePersonId, callback) {
    connection.query("SELECT * FROM sole_person_image WHERE sole_person_id = ?", [solePersonId], function (err, results) {
      if (err) {
        callback(err,null)
        return;
      } else {
        callback(null, results)
      }
    })
  }

  var getSolePersonImageForShowing = ""


getSolePersonImage(req.params.id, function (error, results) {
  console.log("getSolePersonImage get called")
  if (error) {
    console.log(error)
  } else {
    console.log(results)
    getSolePersonImageForShowing = results
    console.log({getSolePersonImageForShowing})
    res.send({
      SolePersonImage: getSolePersonImageForShowing
    })
  }
})
  
})



////////////get sole person image 終了/////////////




////////////get sole person vision 開始/////////////

app.get("/api/soleperson/vision/:id", async (req, res) => {
  console.log("get sole person vision get called")
  console.log(req.params.id)


  function getSolePersonVision (solePersonId, callback) {
    connection.query("SELECT * FROM sole_person_vision WHERE sole_person_id = ?", [solePersonId], function (err, results) {
      if (err) {
        callback(err,null)
        return;
      } else {
        callback(null, results)
      }
    })
  }
function getSolePersonVisionImage (solePersonVisionId, callback) {
  connection.query("SELECT * FROM sole_person_vision_image WHERE sole_person_vision_id = ?",[solePersonVisionId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null,results);
    }
  })
}

var getSolePersonVisionForShowing = "";
var getSolePersonVisionImageForShowing = "";


getSolePersonVision (req.params.id, function (error, results) {
  console.log("getSolePersonVision get called")
  if (error) {
    console.log(error)
    return;
  } else {
    console.log(results)
    getSolePersonVisionForShowing = results
    if (getSolePersonVisionForShowing.length > 0) {
      if (error) throw error;
      else {
        getSolePersonVisionImage(getSolePersonVisionForShowing[0].id, function (error, results) {
          console.log("getSolePersonVisionImage get called")
          if (error) {
            console.log(error)
          } else {
            console.log(results)
            getSolePersonVisionImageForShowing = results
            console.log({getSolePersonVisionForShowing, getSolePersonVisionImageForShowing})
            res.send({
              SolePersonVision: getSolePersonVisionForShowing,
              SolePersonVisionImage: getSolePersonVisionImageForShowing
            })
          }
        })
      }
    } else {
      res.send({
        SolePersonVision: [],
        SolePersonVisionImage: []
      }) 
    }
  }
})


})



////////////get sole person vision 終了/////////////



////////////get ONE Company Product 開始/////////////


app.get("/api/company/specific/item/:id", async (req, res) => {
  console.log("get company specific item get called")
  function getOneCompanyProduct (companyItemId, callback) {
    connection.query("SELECT * FROM company_items WHERE id = ?", [companyItemId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  function getCompanyIdForCompanyInformation (companyItemId, callback) {
  connection.query("SELECT company_id FROM company_items WHERE id = ?", [companyItemId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
  }

  function getCompanyInformation (companyId, callback) {
    connection.query("SELECT * FROM company_information WHERE company_id = ?",[companyId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }

  var getCompanySpecificItemForShowing = "";
  var CompanyId = "";
  var getCompanyInformationForShowing = ""

  getOneCompanyProduct(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificItemForShowing = results
      if (getCompanySpecificItemForShowing){
        getCompanyIdForCompanyInformation(req.params.id, function (error, results) {
          if (error) throw error;
          else {
            console.log(results)
            CompanyId = results
            if (CompanyId) {
              getCompanyInformation (CompanyId[0].company_id, function (error, results) {
                if (error) throw error;
                else {
                  console.log(results)
                  getCompanyInformationForShowing = results
                  res.send({
                    CompanySpecificItem: getCompanySpecificItemForShowing,
                    CompanyInformation: getCompanyInformationForShowing
                  })
                }
              })
            }
          }
        })
      }
    }
    
  })

})



////////////get ONE Company Product 終了/////////////


////////////get ONE Company Product image 開始/////////////

app.get("/api/company/specific/itemimage/:id", async (req, res) => {
  console.log("get company specific item image get called")

  function getOneCompanyProductImage (companyItemId, callback) {
    connection.query("SELECT * FROM company_items_image WHERE company_items_id = ?", [companyItemId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  

  

  var getCompanySpecificItemImageForShowing = "";

  getOneCompanyProductImage(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificItemImageForShowing = results
      if (getCompanySpecificItemImageForShowing){
        console.log(getCompanySpecificItemImageForShowing)
        res.send({
          CompanySpecificItemImage: getCompanySpecificItemImageForShowing
        })
      }
    }
    
  })

})



////////////get ONE Company Product image　終了/////////////




////////////get ONE Company Product video 終了/////////////
app.get("/api/company/specific/itemvideo/:id", async (req, res) => {
  console.log("get company specific item video get called")
  function getOneCompanyProductVideo (companyItemId, callback) {
    connection.query("SELECT * FROM company_items_video WHERE company_items_id = ?", [companyItemId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  

  

  var getCompanySpecificItemVideoForShowing = "";

  getOneCompanyProductVideo(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificItemVideoForShowing = results
      if (getCompanySpecificItemVideoForShowing){
        console.log("company video resilt ===  " +getCompanySpecificItemVideoForShowing)
        res.send({
          CompanySpecificItemVideo: getCompanySpecificItemVideoForShowing
        })
      }
    }
    
  })

})



////////////get ONE Company Product video 終了/////////////






////////////compnay edit item 開始/////////////

app.post("/api/company/admin/edit/item", async (req, res, next) => {
  console.log(req.body.data)


   /////// 途中からcompany_itemに直接　category枠加えた 開始////////////////////////////////

  connection.query("UPDATE company_items SET name =" + "'" + req.body.data.companyItemName + "',price='" + req.body.data.companyItemPrice + "',stock='" + req.body.data.companyItemStock +"',explanation='" + req.body.data.companyItemExplanation + "',updated_at='" + req.body.data.date + "',category='" + req.body.data.companyItemCategory + "' WHERE id = '" + req.body.data.companyItemId + "'", function (error, results, fields) {
    if (error) throw error;
    else {
     
      console.log("company_item update :" + results)
    }
   
  } )

  
 /////// 途中からcompany_itemに直接　category枠加えた　終了////////////////////////////////


  
  
      connection.query("UPDATE company_items_image SET image='" + req.body.data.FirstCompanyItemImage + "' WHERE id = " + "'" + req.body.data.FirstCompanyItemImageId + "'", function(err, results) {
        if (err) throw err;
        
        else {
          console.log("company first image update" + results)
        }
        
      })

      connection.query("UPDATE company_items_image SET image='" + req.body.data.SecondCompanyItemImage + "' WHERE id = " + "'" + req.body.data.SecondCompanyItemImageId + "'", function(err, results) {
        if (err) throw err;
        
        else {
          console.log("company second image update" + results)
        }
        
      })


      connection.query("UPDATE company_items_image SET image='" + req.body.data.ThirdCompanyItemImage + "' WHERE id = " + "'" + req.body.data.ThirdCompanyItemImageId + "'", function(err, results) {
        if (err) throw err;
        
        else {
          console.log("company third image update" + results)
        }
        
      })

      connection.query("UPDATE company_items_image SET image='" + req.body.data.FourthCompanyItemImage + "' WHERE id = " + "'" + req.body.data.FourthCompanyItemImageId + "'", function(err, results) {
        if (err) throw err;
        
        else {
          console.log("company fourth image update" + results)
        }
        
      })

      connection.query("UPDATE company_items_image SET image='" + req.body.data.FifthCompanyItemImage + "' WHERE id = " + "'" + req.body.data.FifthCompanyItemImageId + "'", function(err, results) {
        if (err) throw err;
        
        else {
          console.log("company fifth image update" + results)
        }
        
      })

      

      connection.query("UPDATE company_items_video SET video_path ='" + req.body.data.companyItemVideo + "' WHERE id='" + req.body.data.companyItemVideoId + "'", function(err, result) {
        if (err) throw err
        else {
          console.log("results of updating item video ==  " + result )
        }
      })

     



      function getCompanyCategory (category, callback) {
        connection.query("SELECT id FROM categories WHERE category_name = ?", [category], function (err, results) {
          if (err) {
            callback(err);
            return;
          } else {
            callback(null, results);
          }
        })
      }
    
      var CompanyCategoryId = ""

      getCompanyCategory(req.body.data.companyItemCategory, function (err, results) {
        console.log("getCompanyItemsImage for relation get called") 
if (err) {
  console.log(err)
  return;
} else {
  console.log("update for relation between company_item and category get called")
  console.log(results)
  CompanyCategoryId = results[0].id
  console.log("test  " + CompanyCategoryId)
  connection.query("UPDATE relation_company_items_categories SET categories_id = '"+ CompanyCategoryId + "'WHERE items_id = '" + req.body.data.companyItemId  + "'", function(err, result) {
    if (err) throw err
    else {
      console.log("relaton update  =  " + result)
    }
  })
}




      })

      


     





      
        



  

 

})





////////////compnay edit item 終了/////////////


////////////compnay delete item 開始/////////////


app.post("/api/company/admin/delete/item", async (req, res) => {
  console.log(req.body.data)

  function deleteCompanyItemImage (companyItemId, callback) {
    connection.query("DELETE FROM company_items_image WHERE company_items_id = ?", [companyItemId], function (err, results) {
      if (err) {
        callback(err, null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  function deleteCompanyItemVideo (companyItemId, callback) {
    connection.query("DELETE FROM company_items_video WHERE company_items_id = ?", [companyItemId], function (err, results) {
      if (err) {
        callback(err,null)
        return;
      } else {
        callback(null,results)
      }
    })
  }


  function deleteRelationCompanyAndCategory (ItemId, callback) {
    connection.query("DELETE FROM relation_company_items_categories WHERE items_id = ?", [ItemId], function (err, results) {
      if (err) {
        callback(err);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  deleteCompanyItemImage (req.body.data, function (err, results) {
  console.log("deleteComapnyItem get called")
  if (err) {
    console.log(err)
    return;
  } else {

    deleteCompanyItemVideo (req.body.data, function (err, results) {
      if (err) {
        console.log(err);
        return;
      } else {
    deleteRelationCompanyAndCategory(req.body.data, function (err, results) {
      console.log("delete relation between company item and category get called")
      if (err) {
        console.log(err)
      } else {
        console.log(results)
        console.log("delete company item get called")
        connection.query("DELETE FROM company_items WHERE id = '" + req.body.data + "'", function(err, results) {
          if (err) throw err
          else {
            console.log("delete from company item = " + results)
          }
        })
        
      }
    })
  }
})
  }
})





})







////////////compnay delete item 終了/////////////

////////////////company person edit 開始 /////



app.post("/api/company/admin/edit/person", async (req, res, next) => {
  console.log(req.body.data)


  connection.query("UPDATE company_ceo SET name ='" + req.body.data.CeoName + "',career='" + req.body.data.CeoCareer + "',voice='" + req.body.data.CeoVoice + "' WHERE id ='" + req.body.data.CeoId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("company_ceo resuult ==  " + results)
    }
  })


  connection.query("UPDATE company_charge_person SET name ='" + req.body.data.ChargePersonName + "',career='" + req.body.data.ChargePersonCareer + "',voice='" + req.body.data.ChargePersonVoice + "' WHERE id ='" + req.body.data.ChargePersonId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("company_charge_person resuult ==  " + results)
    }
  })


  connection.query("UPDATE company_extra_person SET name ='" + req.body.data.ExtraPersonName + "',career='" + req.body.data.ExtraPersonCareer + "',voice='" + req.body.data.ExtraPersonVoice + "' WHERE id ='" + req.body.data.ExtraPersonId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("company_extra_person resuult ==  " + results)
    }
  })


  connection.query("UPDATE company_ceo_image SET image = '" + req.body.data.FirstCeoImage + "' WHERE id ='" + req.body.data.FirstCeoImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company first ceo image result ===  " + results)
    }
  })


  connection.query("UPDATE company_ceo_image SET image = '" + req.body.data.SecondCeoImage + "' WHERE id ='" + req.body.data.SecondCeoImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company second ceo image result === " + results)
    }
  })


  connection.query("UPDATE company_charge_person_image SET image = '" + req.body.data.FirstChargePersonImage + "' WHERE id ='" + req.body.data.FirstChargePersonImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company first charge person image result ==  " + results)
    }
  })

  connection.query("UPDATE company_charge_person_image SET image = '" + req.body.data.SecondChargePersonImage + "' WHERE id ='" + req.body.data.SecondChargePersonImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company second charge person image result ==  " + results)
    }
  })


  connection.query("UPDATE company_extra_person_image SET image = '" + req.body.data.FirstExtraPersonImage + "' WHERE id ='" + req.body.data.FirstExtraPersonImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company first extra person image result ==  " + results)
    }
  })

  connection.query("UPDATE company_extra_person_image SET image = '" + req.body.data.SecondExtraPersonImage + "' WHERE id ='" + req.body.data.SecondExtraPersonImageId + "'", function (err, results) {
    if (err) throw err;
    else {
      console.log("UPdate company second extra person image result ==  " + results)
    }
  })


  connection.query("UPDATE company_ceo_video SET video_path ='" + req.body.data.CeoVideoPath + "' WHERE id ='" + req.body.data.CeoVideoPathId + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("result of updating company ceo video path == " + results)
    }
  })

  connection.query("UPDATE company_charge_person_video SET video_path ='" + req.body.data.ChargePersonVideoPath + "' WHERE id ='" + req.body.data.ChargePersonVideoPathId + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("result of updating company charge person video path == " + results)
    }
  })

  connection.query("UPDATE company_extra_person_video SET video_path ='" + req.body.data.ExtraPersonVideoPath + "' WHERE id ='" + req.body.data.ExtraPersonVideoPathId + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("result of updating company extra person video path == " + results)
    }
  })
 
})


////////////////company person edit 終了 /////



////////////////company patent delete 開始 /////

app.post("/api/company/admin/delete/patent", async (req,res) => {
  console.log(req.body.data)

function deleteCompanyPatentImage (companyPatentId, callback) {
  connection.query("DELETE FROM company_patent_image WHERE company_patent_id = ?", [companyPatentId], function (err, results) {
    if (err) {
      callback(err, null);
      return;
    } else {
      callback(null, results)
    }
  })
}

function deleteCompanyPatentVideo (companyPatentId, callback) {
  connection.query("DELETE FROM company_patent_video WHERE company_patent_id = ?", [companyPatentId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}

function deleteCompanyPatent (companyPatentId, callback) {
  connection.query("DELETE FROM company_patent WHERE id = ?", [companyPatentId], function (err, results) {
    if (err) {
      callback(err, null);
      return;
    } else {
      callback(null, results)
    }
  })
}


deleteCompanyPatentImage (req.body.data, function (err, results) {
  console.log("deleteCompanyPatentImage get called")
  if (err) {
    console.log(err)
    return;
  } else {
    deleteCompanyPatentVideo (req.body.data, function (err, results) {
      console.log("deleteCompanyPatentVideo get called")
      if (err) {
        console.log(err)
        return;
      } else {

      
        console.log(results)
        console.log("deleteCompanyPatentVideo get called")
        deleteCompanyPatent (req.body.data, function (err, results) {
          console.log("delete company patent get called")
          if (err) {
            console.log(err)
            return;
          } else {
            console.log("delete company patent get called" + results)
          }
        })
      }
    })
  }
})


})


////////////////company patent delete 終了 /////


////////////////company patent edit 開始/////

app.post("/api/company/admin/edit/patent", async (req, res) => {
  console.log(req.body.data)

connection.query("UPDATE company_patent SET name='" + req.body.data.companyPatentName + "', explanation='" + req.body.data.companyPatentExplanation + "' WHERE id ='" + req.body.data.companyPatentId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of updating comapny_patent ==  " + results)
  }
})

connection.query("UPDATE company_patent_image SET image ='" + req.body.data.FirstCompanyPatentImage + "' WHERE id ='" + req.body.data.FirstCompanyPatentImageId + "'", async function(err, results) {
  if (err) throw err;
  else {
    console.log("reault of updating first company patent result == " + results)
  }
})


connection.query("UPDATE company_patent_image SET image ='" + req.body.data.SecondCompanyPatentImage + "' WHERE id ='" + req.body.data.SecondCompanyPatentImageId + "'", async function(err, results) {
  if (err) throw err;
  else {
    console.log("reault of updating second company patent result == " + results)
  }
})


connection.query("UPDATE company_patent_image SET image ='" + req.body.data.ThirdCompanyPatentImage + "' WHERE id ='" + req.body.data.ThirdCompanyPatentImageId + "'", async function(err, results) {
  if (err) throw err;
  else {
    console.log("reault of updating third company patent result == " + results)
  }
})

connection.query("UPDATE company_patent_image SET image ='" + req.body.data.FourthCompanyPatentImage + "' WHERE id ='" + req.body.data.FourthCCompanyPatentImageId + "'", async function(err, results) {
  if (err) throw err;
  else {
    console.log("reault of updating FourthC company patent result == " + results)
  }
})

connection.query("UPDATE company_patent_image SET image ='" + req.body.data.FifthCompanyPatentImage + "' WHERE id ='" + req.body.data.FifthCompanyPatentImageId + "'", async function(err, results) {
  if (err) throw err;
  else {
    console.log("reault of updating Fifth company patent result == " + results)
  }
})

connection.query("UPDATE company_patent_video SET video_path='" + req.body.data.companyPatentVideoId + "' WHERE id ='" + req.body.data.companyPatentVideoId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of upadting company patent video ==-  " + results)
  }
})


})


////////////////company patent edit 終了 /////




////////////////company information edit 開始 /////

app.post("/api/company/admin/edit/information", async(req, res) => {
console.log(req.body.data)

connection.query("UPDATE company_information SET name ='" + req.body.data.CompanyName + "',adress='" + req.body.data.CompanyAdress + "',vision='" + req.body.data.CompanyVision + "',history='" + req.body.data.CompanyHistory + "',service='" + req.body.data.CompanyService + "',mail='" + req.body.data.CompanyEmail + "' WHERE id ='" + req.body.data.InformationId + "'", function (err, results) {
  if (err) throw err;
  else {
    console.log("result of update company informatiion == " + results)
  }
})


connection.query("UPDATE company_logo SET logo ='" + req.body.data.CompanyLogo + "' WHERE id ='" + req.body.data.CompanyLogoId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of uodate company logo ==  " + results)

  }
})

connection.query("UPDATE company_office_image SET image='" + req.body.data.FirstOfficeImage +"' WHERE id='" +req.body.data.FirstOfficeId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg First office image ==  " + results)
  }
})

connection.query("UPDATE company_office_image SET image='" + req.body.data.SecondOfficeImage +"' WHERE id='" +req.body.data.SecondOfficeId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg second office image ==  " + results)
  }
})


connection.query("UPDATE company_factory_image SET image='" + req.body.data.FirstFactoryImage +"' WHERE id='" +req.body.data.FirstFactoryId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg first factory image ==  " + results)
  }
})

connection.query("UPDATE company_factory_image SET image='" + req.body.data.SecondFactoryImage +"' WHERE id='" +req.body.data.SecondFactoryId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg second factory image ==  " + results)
  }
})

connection.query("UPDATE company_factory_image SET image='" + req.body.data.ThirdFactoryImage +"' WHERE id='" +req.body.data.ThirdFactoryId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg third factory image ==  " + results)
  }
})

connection.query("UPDATE company_factory_image SET image='" + req.body.data.FourthFactoryImage +"' WHERE id='" +req.body.data.FourthFactoryId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of Updatimg fourth factory image ==  " + results)
  }
})










})



////////////////company information edit 終了 /////



////////////////soleperson information edit 開始 /////


app.post("/api/soleperson/admin/edit/information", async (req, res) => {
  console.log(req.body.data)

  connection.query("UPDATE sole_person_information SET name='" + req.body.data.SolePersonName + "',connectionemail='" + req.body.data.SolePersonEmail + "',wechat_id='" + req.body.data.SolePersonWechatId + "' WHERE id ='" + req.body.data.SolePersonInformaionId + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("update sole person information ==  " + results)
    }
  })

  connection.query("UPDATE sole_person_first_image SET images='" + req.body.data.FirstSolePersonImage + "' WHERE sole_person_id='" + req.body.data.SolePersonId + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("results of uopdating sole person first image == " + results)
    }
  })

connection.query("UPDATE sole_person_image SET image='" + req.body.data.FirstSolePersonImage + "' WHERE id='" + req.body.data.FirstSolePersonImageId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results of uopdating sole person first image == " + results)
  }
})


connection.query("UPDATE sole_person_image SET image='" + req.body.data.SecondSolePersonImage + "' WHERE id='" + req.body.data.SecondSolePersonImageId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results of uopdating sole person second image == " + results)
  }
})


connection.query("UPDATE sole_person_image SET image='" + req.body.data.ThirdSolePersonImage + "' WHERE id='" + req.body.data.ThirdSolePersonImageId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results of uopdating sole person third image == " + results)
  }
})


connection.query("UPDATE sole_person_image SET image='" + req.body.data.FourthSolePersonImage + "' WHERE id='" + req.body.data.FourthSolePersonImageId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results of uopdating sole person fourth image == " + results)
  }
})

connection.query("UPDATE sole_person_image SET image='" + req.body.data.FifthSolePersonImage + "' WHERE id='" + req.body.data.FifthSolePersonImageId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results of uopdating sole person fifth image == " + results)
  }
})

connection.query("UPDATE sole_person_history SET history='" + req.body.data.SolePersonHistory + "' WHERE id='" + req.body.data.SolePersonHistoryId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("results for updating sole Person history ==  " + results)
  }
})

connection.query("UPDATE sole_person_history_image SET image='" + req.body.data.FirstSolePersonHistoryImage + "' WHERE id='" + req.body.data.FirstSolePersonHistoryImageId + "'", function (error, results) {
  if (error) throw error;
  else {
    console.log("Result of updating sole person first history image == " + results)
  }
})

connection.query("UPDATE sole_person_history_image SET image='" + req.body.data.SecondSolePersonHistoryImage + "' WHERE id='" + req.body.data.SecondSolePersonHistoryImageId + "'", function (error, results) {
  if (error) throw error;
  else {
    console.log("Result of updating sole person second history image == " + results)
  }
})

connection.query("UPDATE sole_person_history_image SET image='" + req.body.data.ThirdSolePersonHistoryImage + "' WHERE id='" + req.body.data.ThirdSolePersonHistoryImageId + "'", function (error, results) {
  if (error) throw error;
  else {
    console.log("Result of updating sole person third history image == " + results)
  }
})

connection.query("UPDATE sole_person_history_image SET image='" + req.body.data.FourthSolePersonHistoryImage + "' WHERE id='" + req.body.data.FourthSolePersonHistoryImageId + "'", function (error, results) {
  if (error) throw error;
  else {
    console.log("Result of updating sole person fourth history image == " + results)
  }
})


connection.query("UPDATE sole_person_history_image SET image='" + req.body.data.FifthSolePersonHistoryImage + "' WHERE id='" + req.body.data.FifthSolePersonHistoryImageId + "'", function (error, results) {
  if (error) throw error;
  else {
    console.log("Result of updating sole person fourth history image == " + results)
  }
})


connection.query("UPDATE sole_person_vision SET vision='" + req.body.data.SolePersonVision + "' WHERE id='" + req.body.data.SolePersonVisionId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("result of updating sole person vision == " + results )
  }
})

connection.query("UPDATE sole_person_vision_image SET image='" + req.body.data.FirstSolePersonVisionImage + "' WHERE id='" + req.body.data.FirstSolePersonVisionImageId + "'", function(err, results) {
  if(err) throw err;
  else {
    console.log(("result of updating first sole person vision image ==  " + results));
  }
})

connection.query("UPDATE sole_person_vision_image SET image='" + req.body.data.SecondSolePersonVisionImage + "' WHERE id='" + req.body.data.SecondSolePersonVisionImageId + "'", function(err, results) {
  if(err) throw err;
  else {
    console.log(("result of updating second sole person vision image ==  " + results));
  }
})


connection.query("UPDATE sole_person_vision_image SET image='" + req.body.data.ThirdSolePersonVisionImage + "' WHERE id='" + req.body.data.ThirdSolePersonVisionImageId + "'", function(err, results) {
  if(err) throw err;
  else {
    console.log(("result of updating third sole person vision image ==  " + results));
  }
})


connection.query("UPDATE sole_person_vision_image SET image='" + req.body.data.FourthSolePersonVisionImage + "' WHERE id='" + req.body.data.FourthSolePersonVisionImageId + "'", function(err, results) {
  if(err) throw err;
  else {
    console.log(("result of updating fourth sole person vision image ==  " + results));
  }
})


connection.query("UPDATE sole_person_vision_image SET image='" + req.body.data.FifthSolePersonVisionImage + "' WHERE id='" + req.body.data.FifthSolePersonVisionImageId + "'", function(err, results) {
  if(err) throw err;
  else {
    console.log(("result of updating fifth sole person vision image ==  " + results));
  }
})





})



////////////////soleperson information edit 終了 /////



////////////get ONE Sole Person Product 開始/////////////



app.get("/api/soleperson/specific/item/:id",async (req,res) => {
  console.log("get sole person specific item get called")
  function getOneSolePersonProduct (solePersonItemId, callback) {
    connection.query("SELECT * FROM sole_person_items WHERE id=?", [solePersonItemId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null,results)
      }
    })
  }



var getSolePersonSpecificProductForShowing = "";


getOneSolePersonProduct(req.params.id, function (err, results) {
  if (err) throw err;
  else {
    console.log(results)
    getSolePersonSpecificProductForShowing = results
    res.send({
      SolePersonSpecificProduct: getSolePersonSpecificProductForShowing
    })
  }
})


})


////////////get ONE Sole Person Product 終了/////////////



////////////get ONE Sole Person Product imagr 開始/////////////

app.get("/api/soleperson/specific/itemimage/:id", async (req, res) => {
  console.log("get sole person specific item image get called")
  function getOneSolePersonProductImage (solePersonItemId, callback) {
    connection.query("SELECT * FROM sole_person_items_image WHERE sole_person_items_id = ?", [solePersonItemId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }
  



  

  

  var getSolePersonSpecificItemImageForShowing = "";

  getOneSolePersonProductImage(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getSolePersonSpecificItemImageForShowing = results
      if (getSolePersonSpecificItemImageForShowing){
        console.log(getSolePersonSpecificItemImageForShowing)
        res.send({
          SolePersonSpecificProductImage: getSolePersonSpecificItemImageForShowing
        })
      }
    }
    
  })

})





////////////get ONE Sole Person Product image終了/////////////


////////////sole person edit item 開始/////////////
app.post("/api/soleperson/admin/edit/item", async (req, res) => {
  console.log(req.body.data)



connection.query("UPDATE sole_person_items SET name='" + req.body.data.solePersonItemName + "',price='" + req.body.data.solePersonItemPrice + "',explanation='" + req.body.data.solePersonItemExplanation + "' WHERE id='" + req.body.data.solePersonItemId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("sole person item update result ==  " + results)
  }
})


connection.query("UPDATE sole_person_items_image SET image='" + req.body.data.FirstSolePersonItemImage + "' WHERE id='" + req.body.data.FirstSolePersonItemImageId + "'", function(err, results) {
  if (err) throw err
  else {
    console.log("result of updating first sole person item image == " + results)
  }
})


connection.query("UPDATE sole_person_items_image SET image='" + req.body.data.SecondSolePersonItemImage + "' WHERE id='" + req.body.data.SecondSolePersonItemImageId + "'", function(err, results) {
  if (err) throw err
  else {
    console.log("result of updating second sole person item image == " + results)
  }
})


connection.query("UPDATE sole_person_items_image SET image='" + req.body.data.ThirdSolePersonItemImage + "' WHERE id='" + req.body.data.ThirdSolePersonItemImageId + "'", function(err, results) {
  if (err) throw err
  else {
    console.log("result of updating third sole person item image == " + results)
  }
})

connection.query("UPDATE sole_person_items_image SET image='" + req.body.data.FourthSolePersonItemImage + "' WHERE id='" + req.body.data.FourthSolePersonItemImageId + "'", function(err, results) {
  if (err) throw err
  else {
    console.log("result of updating fourth sole person item image == " + results)
  }
})

connection.query("UPDATE sole_person_items_image SET image='" + req.body.data.FifthSolePersonItemImage + "' WHERE id='" + req.body.data.FifthSolePersonItemImageId + "'", function(err, results) {
  if (err) throw err
  else {
    console.log("result of updating fifth sole person item image == " + results)
  }
})



})


////////////sole person edit item 終了/////////////


////////////sole person delete item 開始/////////////

app.post("/api/soleperson/admin/delete/item", async (req, res) => {
  console.log(req.body.data)


  function deleteSolePersonItemImage (solePersonItemId, callback) {
    connection.query("DELETE FROM sole_person_items_image WHERE sole_person_items_id = ?", [solePersonItemId], function (err, results) {
      
  
    if (err) {
      callback (err,null);
      return;
    } else {
      callback (null,results)
    }
  })
  }

function deleteSolePersonItem (solePersonItemId, callback) {
  connection.query("DELETE FROM sole_person_items WHERE id = ?", [solePersonItemId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null,results)
    }
  })
}


deleteSolePersonItemImage(req.body.data, function(err, results) {
  console.log("deleteSolePersonItemImage get called")
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(results)
    deleteSolePersonItem(req.body.data, function (err, results) {
      console.log("deleteSolePersonItem get called")
      if (err) {
        console.log(err)
        return;
      } else {
        console.log("delete sole person item get called")
      }
    })
  }
})



})



////////////sole person delete item 終了/////////////




////////////get ONE Company Patent 開始/////////////

app.get("/api/company/specific/patent/:id", async (req, res) => {
  console.log("get company specific patent get called")

  function getOneCompanyPatent (companyPatentId, callback) {
    connection.query("SELECT * FROM company_patent WHERE id = ?", [companyPatentId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })

  }
  function getCompanyIdForCompanyInformation (companyPatentId, callback) {
    connection.query("SELECT company_id FROM company_patent WHERE id = ?", [companyPatentId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
         callback(null, results)
      }
    })
    }

    function getCompanyInformation (companyId, callback) {
      connection.query("SELECT * FROM company_information WHERE company_id = ?",[companyId], function (err, results) {
        if (err) {
          callback(err,null);
          return;
        } else {
          callback(null, results)
        }
      })
    }

    var getCompanySpecificPatentForShowing = "";
  var CompanyId = "";
  var getCompanyInformationForShowing = ""

  getOneCompanyPatent(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificPatentForShowing = results
      if (getCompanySpecificPatentForShowing){
        getCompanyIdForCompanyInformation(req.params.id, function (error, results) {
          if (error) throw error;
          else {
            console.log(results)
            CompanyId = results
            if (CompanyId) {
              getCompanyInformation (CompanyId[0].company_id, function (error, results) {
                if (error) throw error;
                else {
                  console.log(results)
                  getCompanyInformationForShowing = results
                  res.send({
                    CompanySpecificPatent: getCompanySpecificPatentForShowing,
                    CompanyInformation: getCompanyInformationForShowing
                  })
                }
              })
            }
          }
        })
      }
    }
    
  })

  

})

////////////get ONE Company Patent 終了/////////////


////////////get ONE Company Patent Image 終了/////////////


app.get("/api/company/specific/patentimage/:id", async (req, res) => {
  console.log("get company specific patent image get called")
  
  function getOneCompanyPatentImage (companyPatentId, callback) {
    connection.query("SELECT * FROM company_patent_image WHERE company_patent_id = ?", [companyPatentId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  

  

  var getCompanySpecificPatentImageForShowing = "";

  getOneCompanyPatentImage(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificPatentImageForShowing = results
      if (getCompanySpecificPatentImageForShowing){
        console.log(getCompanySpecificPatentImageForShowing)
        res.send({
          CompanySpecificPatentImage: getCompanySpecificPatentImageForShowing
        })
      }
    }
    
  })

})


////////////get ONE Company Patent Image 終了/////////////


////////////get ONE Company Product video 終了/////////////
app.get("/api/company/specific/patentvideo/:id", async (req, res) => {
  console.log("get company specific patent video get called")

  function getOneCompanyPatentVideo (companyPatentId, callback) {
    connection.query("SELECT * FROM company_patent_video WHERE company_patent_id = ?", [companyPatentId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  

  

  var getCompanySpecificPatentVideoForShowing = "";

  getOneCompanyPatentVideo(req.params.id, function (error, results) {
    if (error) throw error;
    else {
      console.log(results)
      getCompanySpecificPatentVideoForShowing = results
      if (getCompanySpecificPatentVideoForShowing){
        console.log("company video resilt ===  " +getCompanySpecificPatentVideoForShowing)
        res.send({
          CompanySpecificPatentVideo: getCompanySpecificPatentVideoForShowing
        })
      }
    }
    
  })

})



////////////get ONE Company Product video 終了/////////////


////////////get ALL Company information  開始/////////////

app.get("/api/company/all/information", async (req, res) => {
  console.log("getAllCompanyInformation get called")

function getAllCompanyInformation(callback) {
  connection.query("SELECT * FROM company_information", function (err, results) {
    if (err) {
      callback(err,null)
      return;
    } else {
      callback(null, results)
    }
  })
}

function getAllCompanyLogo (callback) {
  connection.query("SELECT * FROM company_logo",function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}

var getAllCompanyInformationForShowing = "";
var getAllCompanyLogoForShowing = ""


getAllCompanyInformation (function (err, results) {
console.log("getAllcompanyinformation get called")
if (err) {
  console.log(err)
  return;
} else {
  console.log(results)
  getAllCompanyInformationForShowing = results
  if (getAllCompanyInformationForShowing.length > 0) {
    if (err) throw err;
    else {
      getAllCompanyLogo (function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log(results)
          getAllCompanyLogoForShowing = results
          console.log({getAllCompanyInformationForShowing, getAllCompanyLogoForShowing})
          res.send({
            AllCompanyInformation: getAllCompanyInformationForShowing,
            AllCompanyLogo: getAllCompanyLogoForShowing
          })
        }
      })
    }
  } else {
    res.send({
      AllCompanyInformation: [], 
      AllCompanyLogo: []
    })
  } 
} 
})


})


////////////get ALL Company information  終了/////////////



//////////// insert message from user to company 開始 ///////////

app.post("/api/contact/from/user/to/company", async (req, res) => {

  console.log(req.body.data)


  const url = "https://vitamin88.com/company/admin/home/" + req.body.data.CompanyId


connection.query("insert into conntact_between_customer_company (user_id,company_id,sender,contact_content,genre,created_at) values ('" + req.body.data.UserId + "','" + req.body.data.CompanyId + "','" + req.body.data.From + "','" + req.body.data.Message + "','" + req.body.data.Genre + "','" + req.body.data.date + "');", function (err, results) {
  if (err) throw err;
  else {
    console.log(results);


    let transporter = nodemailer.createTransport(smtpSetting);
        
    let mailOptions = {
        from: 'kaihatsu@mingle.co.jp',
        to: req.body.data.companyEmail, 
        subject: "VITAmin メール受信通知", // Subject line
        text: "問あわせのメールを受信いたしました。", // plain text body
        html: "<h3>問あわせのメールを受信いたしました。下記のURLからご確認ください</h3><br/><a href=" + url + ">" + url +"</p>", // html body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error.message);
      }
      console.log('success');
  });


  }
})


})


//////////// insert message from user to company for company admin screen 終了 ///////////




//////////// get message from user to company 開始 ///////////

app.get("/api/get/message/from/user/to/company/for/company/admin/screen/:id", async (req, res) => {
  console.log("get message for company admin screen")
  console.log(req.params.id)

  async function getAllCompanyMessage(comapnyId, callback) {
  connection.query("SELECT * FROM conntact_between_customer_company WHERE company_id = ?", [comapnyId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}


// const getCompanyLogo = async (companyId, callback) => {

//   try {
//     connection.query("SELECT * FROM company_logo WHERE company_id = ?", [companyId], function (err, results) {
//       if (err) {
//         callback(err,null);
//         return;
//       } else {
//         callback(null, results)
//       }
//     })
//   } catch (error) {
//       console.log(`Error at translateText --> ${error}`);
//       return 0;
//   }
// };


async function getCompanyLogo(companyId, callback) {
  connection.query("SELECT * FROM company_logo WHERE company_id = ?", [companyId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
} 

async function getCompanyName (companyId, callback) {
  connection.query("SELECT name from company_information WHERE company_id = ?",[companyId], function(err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}


async function getAlluser(callback) {
  connection.query("SELECT * FROM users", function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}



const translateText = async (text, targetLanguage) => {

  try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
  } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
  }
};


const detectLanguage = async (text) => {

  try {
      let response = await translate.detect(text);
      return response[0].language;
  } catch (error) {
      console.log(`Error at detectLanguage --> ${error}`);
      return 0;
  }
}

function sendData (message, logo, name, user) {
  res.send({
    Message: message,
    CompanyLogo: logo,
    CompanyName: name,
    AllUser: user
  })
}

var getAllCompanyMessageForShowing = []
var getCompanyLogoForShowing = "";
var getCompanyNameForShowing = "";
var getAlluserForShowing = ""


 getAllCompanyMessage(req.params.id, function(err, results) {
  console.log("getAllCompanyMessage get called")
  if (err) {
    console.log(err);
    return;
  } else {

    console.log(results)
    console.log("length**************")
    console.log(results.length)
    console.log("length**************")
    // console.log(results[0].contact_content)
if (results.length > 0 ) {


    results.forEach(element => {
      console.log("element***********")
      console.log(element)
      console.log(element.contact_content)
      console.log("element***********")
      

detectLanguage(element.contact_content)
.then((res) => {
    console.log(res);
    translateText(element.contact_content, 'ja')
    .then((res) => {
        console.log(res);
        element["contact_content"] = res
        getAllCompanyMessageForShowing.push(element)
        console.log("fff*********")
        console.log(getAllCompanyMessageForShowing)
        console.log("fff*********")


        if (getAllCompanyMessageForShowing.length === results.length) {
          getCompanyLogo(req.params.id,function (error, results) {
            console.log("getCompanyLogo get called")
            if (error) {
              console.log(error);
              return;
            } else {
              console.log(results)
              getCompanyLogoForShowing = results
              if (getCompanyLogoForShowing) {
                getCompanyName(req.params.id, function (error, results) {
                  console.log("getCompanyName get called")
                  if (error) {
                    console.log(error);
                    return;
                  } else {
                    console.log(results)
                    getCompanyNameForShowing = results
                    if (getCompanyNameForShowing) {
                      getAlluser(function (err, results) {
                        if (err) throw err
                         else {
                          console.log(results)
                          getAlluserForShowing = results
                          if (getAlluserForShowing) {
                          sendData(getAllCompanyMessageForShowing, getCompanyLogoForShowing, getCompanyNameForShowing, getAlluserForShowing)
                        }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }


    })
    .catch((err) => {

        console.log(err);
        getAllCompanyMessageForShowing.push(element)
    });
    
})
.catch((err) => {
    console.log(err);
});




    
      console.log(getAllCompanyMessageForShowing)
    })

  } else {
    res.send({
      Message: [],
    CompanyLogo: [],
    CompanyName: [],
    AllUser: []
    })
  } 

 
    
    
  } 
   
 
}) 
  
 
   
 
    // getAllCompanyMessageForShowing = results
    ////let i = 0;i < results.length + 1, i++ ;
    

   
// for (let i = 0;i < 1, i++ ;) {
// console.log("loop get called")
// detectLanguage(results[i].contact_content)
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log(error);
// });
// translateText(results[i].contact_content, 'jp')
//     .then((res) => {
//         console.log(res);
//         getAllCompanyMessageForShowing.push(res)
//         console.log(getAllCompanyMessageForShowing.length)
//     })
//     .catch((err) => {
//         console.log(err);
//     });

  
// }

    // if (getAllCompanyMessageForShowing.length === results.length) {
      // getCompanyLogo(getAllCompanyMessageForShowing[0].company_id,function (error, results) {
      //   console.log("getCompanyLogo get called")
      //   if (error) {
      //     console.log(error);
      //     return;
      //   } else {
      //     console.log(results)
      //     getCompanyLogoForShowing = results
      //     if (getCompanyLogoForShowing) {
      //       getCompanyName(req.params.id, function (error, results) {
      //         console.log("getCompanyName get called")
      //         if (error) {
      //           console.log(error);
      //           return;
      //         } else {
      //           console.log(results)
      //           getCompanyNameForShowing = results
      //           if (getCompanyNameForShowing) {
      //             getAlluser(function (err, results) {
      //               if (err) {
      //                 console.log(err);
      //                 return;
      //               } else {
      //                 console.log(results)
      //                 getAlluserForShowing = results
      //                 res.send({
      //                   Message: getAllCompanyMessageForShowing,
      //                   CompanyLogo: getCompanyLogoForShowing,
      //                   CompanyName: getCompanyNameForShowing,
      //                   AllUser: getAlluserForShowing
      //                 })
      //               }
      //             })
      //           }
      //         }
      //       })
      //     }
      //   }
      // })
    // }






//  }    
 
// })


})



//////////// get message from user to company 終了 ///////////



//////////// get message from company to user for user screen 開始 ///////////


app.get("/api/get/message/from/company/to/user/for/user/admin/screen/:userId", async (req, res) => {
  console.log("get message for user admin screen")
  console.log(req.params.userId)

  function getAllUserMessage(userId, callback) {
    connection.query("SELECT * FROM conntact_between_customer_company WHERE user_id = ?", [userId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  function getAllCompany(callback) {
    connection.query("SELECT * FROM company_information", function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  async function getAlluser(callback) {
    connection.query("SELECT * FROM users", function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }
  
  
  
  const translateText = async (text, targetLanguage) => {
  
    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
  };



  function resDate (message, company) {
    res.send({
      Message: message,
      AllCompany: company
    })
  }

  var getAllUserMessageForShowing = [];
  var getAllCompanyForShowing = "";

  getAllUserMessage(req.params.userId, function (err, results) {
    console.log("getAllUserMessageForShowing get called")
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(results)
      

      results.forEach(element => {
        console.log("element***********")
        console.log(element)
        console.log(element.contact_content)
        console.log("element***********")
  
  detectLanguage(element.contact_content)
  .then((res) => {
      console.log(res);
      translateText(element.contact_content, 'zh-CN')
      .then((res) => {
          console.log(res);
          element["contact_content"] = res
          getAllUserMessageForShowing.push(element)
          console.log("fff*********")
          console.log(getAllUserMessageForShowing)
          console.log("fff*********")
  
  
          if (getAllUserMessageForShowing.length === results.length) {
            getAllCompany(function (err, results) {
              console.log("getAllCompany get called")
              if (err) {
                console.log(err);
                return;
              } else {
                console.log(results)
                getAllCompanyForShowing = results
                resDate(getAllUserMessageForShowing,getAllCompanyForShowing)
              }
            })
          }
  
  
      })
      .catch((err) => {
  
          console.log(err);
          getAllUserMessageForShowing.push(element)
      });
      
  })
  .catch((err) => {
      console.log(err);
  });
  
  
  
  
      
        console.log(getAllUserMessageForShowing)
      })


      
    }
  })



})



//////////// get message from company to user for user screen 終了 ///////////


//////////// insert message from user to soleperson 開始 ///////////

app.post("/api/contact/from/user/to/soleperson", async (req, res) => {

  console.log(req.body.data)

  const url = "https://vitamin88.com/soleperson/admin/home/" + req.body.data.SolePersonId


connection.query("insert into contact_between_customer_sole_person (user_id,sole_person_id,sender,contact_content,genre,created_at) values ('" + req.body.data.UserId + "','" + req.body.data.SolePersonId + "','" + req.body.data.From + "','" + req.body.data.Message + "','" + req.body.data.Genre + "','" + req.body.data.date + "');", function (err, results) {
  if (err) throw err;
  else {
    console.log(results);

    let transporter = nodemailer.createTransport(smtpSetting);
        
    let mailOptions = {
        from: 'kaihatsu@mingle.co.jp',
        to: req.body.data.SolePersonEmail, 
        subject: "VITAmin メール受信通知", // Subject line
        text: "問あわせのメールを受信いたしました。", // plain text body
        html: "<h3>問あわせのメールを受信いたしました。下記のURLからご確認ください</h3><br/><a href=" + url + ">" + url +"</p>", // html body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error.message);
      }
      console.log('success');
  });

  }
})


})


//////////// insert message from user to soleperson 開始 ///////////







// app.get("/api/get/message/content/from/user/to/company/for/company/admin/screen/:userId/:companyId", async (req, res) => {
//   console.log("get message content for company admin screen")
//   console.log(req.params.userId)
//   console.log(req.params.companyId)

// function getMessage(userId, companyId, callback) {
//   connection.query("SELECT * FROM conntact_between_customer_company WHERE user_id = ? AND company_id = ?", [userId, companyId], function (err, results) {
//     if (err) {
//       callback(err, null);
//       return;
//     } else {
//       callback(null, results)
//     }
//   })
// }

// function getCompanyLogo(comapnyId, callback) {
//   connection.query("SELECT * FROM company_logo WHERE company_id = ?", [companyId], function (err, results) {
//     if (err) {
//       callback(err,null);
//       return;
//     } else {
//       callback(null, results)
//     }
//   })
// }

// var getMessageForShowing = ""
// var getCompanyLogoForShowing = ""

// getMessage(req.params.userId, reqp.params.comapnyId, function (err, results) {
//   console.log("getMessage get called")
//   if (err) {
//     console.log(err)
//     return;
//   } else {
//     console.log(results)
//     getMessageForShowing = results
//     if (getMessageForShowing) {
//       getCompanyLogo(req.params.comapnyId, function (err, results) {
//         console.log("getCompanyLogo get called")
//         if (err) {
//           console.log(err);
//           return;
//         } else {
//           console.log(results)
//           getCompanyLogoForShowing = results
//           res.send({
//             MessageContent: getMessageForShowing,
//             CompanyLogo: getCompanyLogoForShowing
//           })
//         }
//       })
//     }
//   }
// })



// })


//////////// get message content from user to company 終了 ///////////


//////////// send message  from company to user 開始 ///////////


app.post("/api/send/message/from/company/to/user", async (req, res) => {
  console.log(req.body.data)

  // const url = "http://localhost:3000//user/admin/page/" + req.body.data.UserId
  const url = "https://vitamin88.com/user/admin/page/" + req.body.data.UserId


  connection.query("insert into conntact_between_customer_company (user_id,company_id,sender,contact_content,created_at) values ('" + req.body.data.UserId + "','" + req.body.data.CompanyId + "','" + req.body.data.sender + "','" + req.body.data.message + "','" + req.body.data.date + "');", function (err, results) {
if (err) throw err;
else {
  console.log(results);
  

  let transporter = nodemailer.createTransport(smtpSetting);
        
  let mailOptions = {
      from: 'kaihatsu@mingle.co.jp',
      to: req.body.data.userEmail, 
      subject: "VITAmin 接收讯息", // Subject line
      text: "我收到了公司的电子邮件", // plain text body
      html: "<h3>我收到了公司的电子邮件。请点击下面的URL查看</h3><br/><a href=" + url + ">" + url +"</p>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});


}
  })
})


//////////// send message  from company to user 終了 ///////////


//////////// send message  from soleperson to user 開始 ///////////


app.post("/api/send/message/from/soleperson/to/user", async (req, res) => {
  console.log(req.body.data)

  const url = "https://vitamin88.com/user/admin/page/" + req.body.data.UserId


  connection.query("insert into contact_between_customer_sole_person (user_id,sole_person_id,sender,contact_content,created_at) values ('" + req.body.data.UserId + "','" + req.body.data.SolePersonId + "','" + req.body.data.sender + "','" + req.body.data.message + "','" + req.body.data.date + "');", function (err, results) {
if (err) throw err;
else {
  console.log(results);

  let transporter = nodemailer.createTransport(smtpSetting);
        
  let mailOptions = {
      from: 'kaihatsu@mingle.co.jp',
      to: req.body.data.Email, 
      subject: "VITAmin 接收讯息", // Subject line
      text: "我收到个人的消息", // plain text body
      html: "<h3>我收到个人的消息</h3><br/><a href=" + url + ">" + url +"</p>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});

}
  })
})


//////////// send message  from sole person to user 終了 ///////////





///////////  get all company 開始 //////////////

app.get("/api/admin/get/all/company", async (req, res) => {

connection.query("select * from company", function (err, results) {
  if (err) throw err;
  else {
    console.log(results)
    res.send({
      AllCompany: results
    })
  }
})

})



///////////  get all company 終了 //////////////


///////////  get all solePerson 開始 //////////////

app.get("/api/admin/get/all/soleperson", async (req, res) => {

  connection.query("select * from sole_person", function (err, results) {
    if (err) throw err;
    else {
      console.log(results)
      res.send({
        AllSolePerson: results
      })
    }
  })
})


///////////  get all solePerson 終了 //////////////


////////////get ALL Sole Person information  開始/////////////

app.get("/api/soleperson/all/information", async (req, res) => {
  console.log("get all sole person informationi get called")
   
  function getAllSolePersonInformation(callback) {
    connection.query("SELECT * FROM sole_person_information", function(err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  



function getSolePersonFirstImage (callback) {
  connection.query("SELECT * FROM sole_person_first_image", function(err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}


var getAllSolePersonInformationiForShowing = "";
var getAllSolePersonFirstImageForShowing = ""



getAllSolePersonInformation (function (err, results) {
  console.log("getAllSolePersonInformation get called")
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(results)
    getAllSolePersonInformationiForShowing = results
    if (getAllSolePersonInformationiForShowing.length > 0) {
      console.log("fjiejf  ===  " + getAllSolePersonInformationiForShowing[0].sole_person_id)
      getSolePersonFirstImage (function (error, results) {
        console.log("fet sole person image get called")
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("reault of get sole person image ==  " + results)
          getAllSolePersonFirstImageForShowing = results
          res.send({
            AllSolePersonInformation: getAllSolePersonInformationiForShowing,
            AllSolePersonFirstImage: getAllSolePersonFirstImageForShowing
          })
  
        }
      })
      
     
      
    }
  }
})


})


////////////get ALL Sole Person information  終了/////////////


//////// get sole person vision and visoni image for sole perosn vision detail 開始 ////////


app.get("/api/soleperson/get/vision/detail/:id", async (req, res) => {
  console.log("get sole person vision detail get called")


  function getSolePersonVision (visionId, callback) {
    connection.query("SELECT * FROM sole_person_vision WHERE id = ?",[visionId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  function getSolePersonVisionImage (visionId, callback) {
    connection.query("SELECT * FROM sole_person_vision_image WHERE sole_person_vision_id = ?", [visionId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


var solePersonVisionForShowing = "";
var solePersonVisionImageForShowing = "";

getSolePersonVision (req.params.id, function (err, results) {
  if (err) {
    console.log(err)
  } else {
    console.log(results)
    solePersonVisionForShowing = results;
    if (solePersonVisionForShowing) {
      getSolePersonVisionImage (req.params.id, function (err, results) {
        if (err) {
          console.log(err)
        } else {
          console.log(results)
          solePersonVisionImageForShowing = results
          res.send({
            Vision: solePersonVisionForShowing,
            VisionImage: solePersonVisionImageForShowing
          })
        }
      })
    }
  }
})

})

//////// get sole person vision and visoni image for sole perosn vision detail 終了 ////////


//////////// get message from user to soleperson for soleperson screen 開始 ///////////

app.get("/api/get/message/from/user/to/soleperson/for/soleperson/admin/screen/:id", async (req, res) => {
  console.log("get message for sole person admin screen")
  console.log(req.params.id)

function getAllSolePersonMessage(solePersonId, callback) {
  connection.query("SELECT * FROM contact_between_customer_sole_person WHERE sole_person_id = ?", [solePersonId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}

function getSolePersonImage(solePersonId, callback) {
  connection.query("SELECT * FROM sole_person_image WHERE sole_person_id = ?", [solePersonId], function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
} 

function getSolePersonName (solePersonId, callback) {
  connection.query("SELECT name from sole_person_information WHERE sole_person_id = ?",[solePersonId], function(err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}



const translateText = async (text, targetLanguage) => {

  try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
  } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
  }
};


const detectLanguage = async (text) => {

  try {
      let response = await translate.detect(text);
      return response[0].language;
  } catch (error) {
      console.log(`Error at detectLanguage --> ${error}`);
      return 0;
  }
}



function getAlluser(callback) {
  connection.query("SELECT * FROM users", function (err, results) {
    if (err) {
      callback(err,null);
      return;
    } else {
      callback(null, results)
    }
  })
}


function sendDate(message,image,name, user) {
  res.send({
    Message: message,
    SolePersonImage: image,
    SolePersonName: name,
    AllUser: user
  })
}


var getAllSolePersonMessageForShowing = [];
var getSolePersonImageForShowing = "";
var getSolePersonNameForShowing = "";
var getAlluserForShowing = ""

getAllSolePersonMessage(req.params.id, function(err, results) {
  console.log("getAllSolePersonMessage get called")
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(results)

    if (results.length > 0) {

    
    
    results.forEach(element => {
      console.log("element***********")
      console.log(element)
      console.log(element.contact_content)
      console.log("element***********")

detectLanguage(element.contact_content)
.then((res) => {
    console.log(res);
    translateText(element.contact_content, 'ja')
    .then((res) => {
        console.log(res);
        element["contact_content"] = res
        getAllSolePersonMessageForShowing.push(element)
        console.log("fff*********")
        console.log(getAllSolePersonMessageForShowing)
        console.log("fff*********")


        if (getAllSolePersonMessageForShowing.length === results.length) {
          
            getSolePersonImage(req.params.id,function (error, results) {
              console.log("getSolePersonImage get called")
              if (error) {
                console.log(error);
                return;
              } else {
                console.log(results)
                getSolePersonImageForShowing = results
                if (getSolePersonImageForShowing) {
                  getSolePersonName(req.params.id, function (error, results) {
                    console.log("getSolePersonName get called")
                    if (error) {
                      console.log(error);
                      return;
                    } else {
                      console.log(results)
                      getSolePersonNameForShowing = results
                      if (getSolePersonNameForShowing) {
                        getAlluser(function (err, results) {
                          if (err) {
                            console.log(err);
                            return;
                          } else {
                            console.log(results)
                            getAlluserForShowing = results
                            sendDate(getAllSolePersonMessageForShowing,getSolePersonImageForShowing,getSolePersonNameForShowing , getAlluserForShowing)
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          


        }


    })
    .catch((err) => {

        console.log(err);
        getAllSolePersonMessageForShowing.push(element)
    });
    
})
.catch((err) => {
    console.log(err);
});




    
      console.log(getAllSolePersonMessageForShowing)
    })

  } else {
    res.send({
      Message: [],
    SolePersonImage: [],
    SolePersonName: [],
    AllUser: []
    })
  }




    
  }
})


})



//////////// get message from user to company 終了 ///////////



//////////// get message from sole person to user for user screen 開始 ///////////


app.get("/api/get/message/from/soleperson/to/user/for/user/admin/screen/:userId", async (req, res) => {
  console.log("get message for user admin screen")
  console.log(req.params.userId)

  function getAllUserMessage(userId, callback) {
    connection.query("SELECT * FROM contact_between_customer_sole_person WHERE user_id = ?", [userId], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }



  function getAllSolePerson(callback) {
    connection.query("SELECT * FROM sole_person_information", function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  const detectLanguage = async (text) => {

    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
  }


  const translateText = async (text, targetLanguage) => {
  
    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
  };



function sendDate(message,solePerson) {
  res.send({
    Message: message,
    AllSolePerson: solePerson
  })
}


  var getAllUserMessageForShowing = [];
  var getAllSolePersonForShowing = "";

  getAllUserMessage(req.params.userId, function (err, results) {
    console.log("getAllUserMessageForShowing get called")
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(results)


      results.forEach(element => {
        console.log("element***********")
        console.log(element)
        console.log(element.contact_content)
        console.log("element***********")
  
  detectLanguage(element.contact_content)
  .then((res) => {
      console.log(res);
      translateText(element.contact_content, 'zh-CN')
      .then((res) => {
          console.log(res);
          element["contact_content"] = res
          getAllUserMessageForShowing.push(element)
          console.log("fff*********")
          console.log(getAllUserMessageForShowing)
          console.log("fff*********")
  
  if (getAllUserMessageForShowing.length === results.length) {

    
      getAllSolePerson(function (err, results) {
        console.log("getAllSolePerson get called")
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(results)
          getAllSolePersonForShowing = results
          sendDate(getAllUserMessageForShowing,getAllSolePersonForShowing)
        }
      })
    

  }
  
  
      })
      .catch((err) => {
  
          console.log(err);
          getAllUserMessageForShowing.push(element)
      });
      
  })
  .catch((err) => {
      console.log(err);
  });
  
  
  
  
      
        console.log(getAllUserMessageForShowing)
      })


      
      
    }
  })



})



//////////// get message from sole person to user for user screen 終了 ///////////




////////// get company extra page 開始 ////////

app.get("/api/company/extra/page/:id", async (req, res) => {
  console.log("get company extra page get called")


  
  function getComapanyExtraPage(companyId, callback) {
    connection.query("SELECT * FROM company_extra_page WHERE company_id = ?", [companyId], function(err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


var companyExtraPageForShowing = ""

getComapanyExtraPage(req.params.id, function (err, results) {
  console.log("get company extra page get called")
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(results)
    companyExtraPageForShowing = results
    res.send({
      CompanyExtraPage: companyExtraPageForShowing
    })
  }
})


})


////////// get company extra page 終了 ////////


////////////compnay delete extra screen 開始/////////////


app.post("/api/company/admin/delete/extra/page", async (req, res) => {
  console.log(req.body.data)

  function deleteCompanyExtraPageImage (extraPageId, callback) {
    connection.query("DELETE FROM company_extra_page_content WHERE company_extra_page_id = ?", [extraPageId], function (err, results) {
      if (err) {
        callback(err, null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  function deleteCompanyExtraPage (extraPageId, callback) {
    connection.query("DELETE FROM company_extra_page WHERE id = ?", [extraPageId], function (err, results) {
      if (err) {
        callback(err, null);
        return;
      } else {
        callback(null, results)
      }
    })
  }
  


  
  deleteCompanyExtraPageImage(req.body.data, function (err, results) {
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      console.log("delete company extra page get called")
      deleteCompanyExtraPage(req.body.data, function (err, results) {
        if (err) {
          console.log(err)
          return;
        } else {
          console.log("delete company extra page get called")
        }
      })
    }
  })



 



})

////////////compnay delete extra screen 終了/////////////


/////////  register company extra page  開始 ///////////


app.post("/api/company/register/extra/page", async (req, res) => {
  console.log(req.body.data)

connection.query("INSERT INTO company_extra_page(company_id,name,created_at) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.companyExtraPageTitle + "'" + "," + "'" + req.body.data.date + "'" + ");", function (error, results) {
  if (error) throw error;
  else {
    console.log("new company extra page insert get called")
  }
})

})


/////////  register company extra page  終了 ///////////



////////// get INSIDE company extra page 開始 ////////


app.get("/api/inside/company/extra/page/:id", async (req, res) => {
  console.log("get INSIDE company extra page get called")


  
  function getInsideComapanyExtraPage(pageId, callback) {
    connection.query("SELECT * FROM company_extra_page_content WHERE company_extra_page_id = ?", [pageId], function(err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


var insideCompanyExtraPageForShowing = ""

getInsideComapanyExtraPage(req.params.id, function (err, results) {
  console.log("get INSIDE company extra page get called")
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(results)
    insideCompanyExtraPageForShowing = results
    res.send({
      InsideCompanyExtraPage: insideCompanyExtraPageForShowing
    })
  }
})


})




////////// get INSIDE company extra page 終了 ////////


/////////  delete Inside company extra page content 開始 ///////


app.post("/api/company/admin/delete/inside/extra/page", async (req, res) => {
  console.log(req.body.data)

  function deleteInsideCompanyExtraPageContent (extraPageContentId, callback) {
    connection.query("DELETE FROM company_extra_page_content WHERE id = ?", [extraPageContentId], function (err, results) {
      if (err) {
        callback(err, null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


  

  
  deleteInsideCompanyExtraPageContent(req.params.data, function (err, results) {
    if (err) {
      console.log(err)
      return;
    } else {
      console.log(results)
      console.log("deleteInsideCompanyExtraPageContent get called")
      
    }
  })



 



})


/////////  delete Inside company extra page content 終了 ///////


////// comapany register extra page content 開始 ///////

app.post("/api/company/register/content/extra/page", async (req, res) => {
  console.log("test test test ====  " +req.body.data)


connection.query("INSERT INTO company_extra_page_content (company_extra_page_id,content,image1,image2) values (" + "'" + req.body.data.pageId + "','" + req.body.data.companyContent + "','" + req.body.data.FirstCompanyExtraPageImage + "','" + req.body.data.SecondCompanyExtraPageImage + "');", function (err, results) {
  if(err) throw err;
  else {
    console.log("insert company_extra_page_content get called")
  }
})

})


////// comapany register extra page content 終了 ///////


///////  get one company extra page 開始 /////////

app.get("/api/company/specific/extra/page/:id", async (req, res) => {
  console.log("get one specific extra page get called")

  function getOneCompanyExtraPage(id, callback) {
    connection.query("SELECT * FROM company_extra_page_content WHERE id = ?",[id], function (err, results) {
      if (err) {
        callback(err,null);
        return;
      } else {
        callback(null, results)
      }
    })

  }



  getOneCompanyExtraPage(req.params.id, function(err, results) {
    console.log("get specific company extra page get called")
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(results)

      res.send({
        SpecificExtraPage: results
      })
    }
  })


})


//////// get one company extra page　　終了   ///////////



/////////// edit company extra page 開始 ////////


app.post("/api/company/admin/edit/extra/page", async (req, res) => {

console.log(req.body.data)

connection.query("UPDATE company_extra_page_content SET content='" + req.body.data.Content + "',image1='" + req.body.data.firstCompanyExtraPageImage + "',image2='" + req.body.data.secondCompanyExtraPageImage +"' WHERE id ='" + req.body.data.extraPageContentId + "'", function(err, results) {
  if (err) throw err;
  else {
    console.log("upload company extra page")
  }
})

})


/////////// edit company extra page 終了 ////////




  //date型はsteing型のように囲め！
    
  



    // app.post("/api/users/signin", async (req, res) => {

    //   console.log("hey" +req.body.data.email)
    //   console.log("hey" +req.body.data.password)
    
    //   function getSigninUser(email, password, callback) {
    //   connection.query("SELECT * FROM USERS WHERE email = ? and password = ?", [email, password], function(err, results){
    //     if (err)
    //     callback(err,null);
    //     else
    //     callback(null,results)
    //   });
    //   }
    
    //   var signinUser = {}
    
    //   getSigninUser(req.body.data.email, req.body.data.password, function(err,data){
    //     if (err) {
    //       console.log(err)
    //     } else {
         
    //       signinUser = data
    //       console.log("result from db is :",data)
    
    //       console.log(signinUser)
    //       console.log(signinUser[0].id)
    //       console.log("email:" + req.body.data.email)
    //       console.log("password:" + req.body.data.password)
    //       signinUser = data
          
    
    
    //       if(signinUser){
    //         res.send({
    //           _id: signinUser[0].id,
    //           name: signinUser[0].name,
    //           email: signinUser[0].email,
    //           isAdmin: signinUser[0].isAdmin,
    //           token: getToken(signinUser)
          
    //         })
    //         } else {
    //           res.status(401).send({msg:"invalid Email or Password"})
    //         }
    //         console.log("testId:" + signinUser[0].id)
    
    //     }
    //   })
    
      
    // })  




////teat

app.get("/api/products/:id", async (req, res) => {
  function getCompanyCategory(category, callback) {
    connectin.query("SELECT * FROM categories WHERE name = ?",[category], function(err, results) {
      if (err) {
        callback(err,null);
      } else {
        callback(null,results)
      }
    })







    // SELECT * FROM companies_items INNER JOIN relation_companies_items_categories ON company_items.id = relation_companies_items_categories.compay_ite,
    //ms.id inner join categories on relation_companies_items_categories.categories.id = categories.id WHERE categories.name = {req.body.id}


function getItemId(categoryName, callback) {
  connection.query("SELECT * FROM company_items WHERE EXISTS () ")
}



var selectedCategory = "";
var itemId = "";

getCategory(req.params.id, function (err,data){
  if (err) {
    console.log(err)
  } else {
    selectedCategory = data
    console.log("selectedCatedory:" + selectedCategory)

if (selectedCategory){

} else {
  res.status(401).send({msg:"problem with retriving category"})
}

  }
})

  }
})


// test//////


    





///////　カテゴリー選択からアイテム一覧　開始 /////////


app.get("/api/get/companyproducts/category/:id", (req, res) => {
    console.log(req.params.id)
    const category = req.params.id;
   
function getCompanyItemSortedByCategory(CategoryName, callback) {
  connection.query('SELECT * FROM company_items WHERE category = ?', [CategoryName], function (err, results) {
    if (err) {
      callback(err,null)
      return;
    } else {
      callback(null, results)
    }
  });
}   

function getCompanyItemImageSortedByCategory(CompanyItemCategory, callback) {
  connection.query("SELECT * FROM company_items_image WHERE company_items_id = ?", [CompanyItemCategory], function (err, results) {
    if (err) {
      callback(err, null);
      return;
    } else {
      callback(null, results)
    }
  })
}

var CompanyItemByCategoyForShowing = ""
var CompanyItemByCategoyImageArrayForShowing = []

getCompanyItemSortedByCategory (category, function (err, results) {
  console.log('getCompanyItemSortedByCategory get called')
  if (err) throw err;
    else {
      console.log(results)
      CompanyItemByCategoyForShowing = results
      if (CompanyItemByCategoyForShowing){
        console.log(CompanyItemByCategoyForShowing.length) 
        for (let i = 0; i < CompanyItemByCategoyForShowing.length; i++) {
          console.log(CompanyItemByCategoyForShowing[i].id + "test array")
          getCompanyItemImageSortedByCategory(CompanyItemByCategoyForShowing[i].id, function (error, results) {
            if (error) throw error;
            else {
              console.log(results)
              CompanyItemByCategoyImageArrayForShowing.push({results})
              console.log("heyyyyyyyyyy        "+ CompanyItemByCategoyImageArrayForShowing)
              
            }
            console.log("iiiiiiiiii" + CompanyItemByCategoyImageArrayForShowing)
            if (i === CompanyItemByCategoyForShowing.length - 1 ) {
              res.send({
                CompanyItemByCategory: CompanyItemByCategoyForShowing,
                CompanyItemImageByCategory: CompanyItemByCategoyImageArrayForShowing
              })
            }
            
          })


        }          

        
        
      }
      
    }
})



});


///////　カテゴリー選択からアイテム一覧　終了 /////////


///////  company change pass  開始 ////////////

app.post("/api/company/change/password", async (req, res) => {

  
  console.log("hey" +req.body.data.password)
  console.log(req.body.data.id)
  console.log("company change pass")

  function getSigninUser(companyId, callback) {
  connection.query("SELECT * FROM company WHERE id = ?", [companyId], function(err, results){
    if (err)
    callback(err,null);
    else
    callback(null,results)
  });
  }

  var adminComapny = {}

  getSigninUser(req.body.data.id, function(err,data){
    if (err) {
      console.log(err)
    } else {

      bcrypt.compare(req.body.data.password, data[0].password, function(err, result) {
        if (result === true) {

          adminComapny = data
          console.log("result from db is :",data)
    
          console.log(adminComapny)
          console.log(adminComapny[0].password)
          
          console.log("password:" + req.body.data.password)
          adminComapny = data
          
    
    
          if(adminComapny){
            res.send({
              _id: adminComapny[0].id,
              
              password: adminComapny[0].password,
              isAdmin: adminComapny[0].isAdmin,
              token: getCompanyPasswordToken(adminComapny)
          
            })
            } else {
              res.status(401).send({msg:"invalid Email or Password"})
            }

        } else {
          res.status(401).send({msg:"invalid ID or Password"})

        }
      })
     
      
        

    }
  })

  
}) 



///////  company change pass  終了 ////////////



//////  compamny enter new password 開始 ///////

app.post("/api/company/replace/new/password", async (req, res) => {

  


  function insertNewCompanyPassword (password, id, callback) {

    bcrypt.hash(password, saltRounds, function(err, hash) {
  
      connection.query("UPDATE company SET password = ? WHERE id = ?;", [hash, id], function(err, results) {
        if (err) 
        callback (err);
        else {
          callback (null, results)
        }
      })
  
    })
  }
  insertNewCompanyPassword(req.body.data.password, req.body.data.id, function(err, results) {
    console.log("insertNewCompany get called")
    if (err) {
      console.log(err);
    } else {
      console.log(results)
      res.status(200).send({msg: "success!"})
  
    }
  })

  
})

//////  compamny enter new password 終了 ///////


////// company register M&A  開始 ////////


app.post("/api/company/register/m/and/a", async (req, res, next) => {
  console.log(req.body.data)


 /////// 途中からcompany_itemに直接　category枠加えた 開始////////////////////////////////

  connection.query("insert into m_and_a_information(company_id,company_category,prefecture,company_form,compamy_age,workers_number,price,how_to_sell,to_who,detail_of_business,request,imortant_point,why,business_describe,sales) values (" + "'" + req.body.data.companyId + "'" + "," + "'" + req.body.data.companyCategory + "'" + "," + "'" + req.body.data.prefecture + "'" + "," + "'" + req.body.data.companyForm + "'" + "," + "'" + req.body.data.companyAge + "'" + "," + "'" + req.body.data.workersNumber + "'" + "," + "'" + req.body.data.companyPrice + "'" + "," + "'" + req.body.data.howToSell + "'" + "," + "'" + req.body.data.toWho + "'" + "," + "'" + req.body.data.detailOfBusiness + "'" + "," + "'" + req.body.data.request + "'" + "," + "'" + req.body.data.mostImportant + "'" + "," + "'" + req.body.data.why + "'" + "," + "'" + req.body.data.describeBusiness  + "'" + "," + "'" + req.body.data.companySales + "'" + ");", function (error, results, fields) {
    if (error) throw error;
    else {
     
      console.log("company_M&A insert :" + results)
    }
   
  } )

   /////// 途中からcompany_itemに直接　category枠加えた　終了////////////////////////////////






})


//////comopany register M&A 終了 /////////

///// get company M&A information by category  開始 /////


app.get("/api/get/m/and/a/information/category/:id", (req, res) => {
  console.log(req.params.id)
  const category = req.params.id;
 
function getMaddAINnformationSortedByCategory(CategoryName, callback) {
connection.query('SELECT * FROM m_and_a_information WHERE company_category = ?', [CategoryName], function (err, results) {
  if (err) {
    callback(err,null)
    return;
  } else {
    callback(null, results)
  }
});
}   

var getMaddAINnformationSortedByCategoryForShowing = ""



getMaddAINnformationSortedByCategory (category, function (err, results) {
console.log('getMaddAINnformationSortedByCategory get called')
if (err) throw err;
  else {
    console.log(results)
    getMaddAINnformationSortedByCategoryForShowing = results
    if (getMaddAINnformationSortedByCategoryForShowing){
      console.log(getMaddAINnformationSortedByCategoryForShowing.length) 
      
        res.send({
          CompanyMandAInformtionForShowing: getMaddAINnformationSortedByCategoryForShowing,
         
        })

           

      
      
    }
    
  }
})



});




///// get company M&A information by category  終了 /////

///// get company M&A information by campany  開始 /////

app.get("/api/company/get/m/and/a/:id",async(req,res) => {
  console.log("getCompanyMandAInfromationi get called")

  function getCompanyMandAInformation (companyId,callback) {
    connection.query("SELECT * FROM m_and_a_information WHERE company_id = ?", [companyId], function(err, results) {
      if (err) {
        callback(err, null);
        return;
      } else {
        callback(null, results)
      }
    })
  }


var MandAInformationForShowing = ""


getCompanyMandAInformation(req.params.id, function(err, results) {
  console.log("getCompanyMandAInformation get called")
  if (err) {
    console.log(err)
    return;
  } else {
    console.log(results)
    MandAInformationForShowing = results
    if (MandAInformationForShowing) {
      res.send({
        CompanyMandAInformation: MandAInformationForShowing
      })
    }
  }
})



})

///// get company M&A information by campany  終了 /////

///// edit company M&A information   開始 /////
app.post("/api/company/admin/edit/m/and/a", async(req,res) => {

  console.log(req.body.data)


  connection.query("UPDATE m_and_a_information SET company_id='" + req.body.data.companyId + "',company_category='" + req.body.data.companyCategory + "',prefecture='" + req.body.data.prefecture+ "',company_form='" + req.body.data.companyForm + "',compamy_age='" + req.body.data.companyAge + "',workers_number='" + req.body.data.workersNumber + "',price='" + req.body.data.companyPrice + "',how_to_sell='" + req.body.data.howToSell + "',to_who='" + req.body.data.toWho + "',detail_of_business='" + req.body.data.detailOfBusiness + "',request='" + req.body.data.request + "',imortant_point='" + req.body.data.mostImportant + "',why='" + req.body.data.why + "',business_describe='" + req.body.data.describeBusiness + "',sales='" + req.body.data.companySales  +"' WHERE id ='" + req.body.data.id + "'", function(err, results) {
    if (err) throw err;
    else {
      console.log("upload m and a infomation")
    }
  })
  

})


///// edit company M&A information   終了 /////


app.get("/api/products", (req, res) => {
    
    res.send(data.products)
});


app.listen(5000, () => {
    console.log('Server Started at http://localhost:5000')
})

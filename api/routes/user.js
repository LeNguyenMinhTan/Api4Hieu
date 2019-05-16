const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');


router.post('/signup',(req,res,next)=>{
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if (user.length>=1){
            return res.status(409).json({
                message: "Mail exists"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        name: req.body.name,
                        address: req.body.address,
                        phone: req.body.phone,
                        password: hash  
                    });
                    user.save()
                    .then(result=>{
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
});

router.post('/signin',(req,res,next) =>{
    User.find({ email: req.body.email})// i use User.find replace User.findOne cause i'll use user[0] 
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err, result)=>{//first user found in array
            if(err){
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if(result){
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message:"Auth successful",
                    token: token
                });
            }
            return res.status(401).json({
                message:"Auth failed"
            });
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.get('/', checkAuth,(req,res,next)=>{
    User.find()
    .select("name email _id address phone")
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            Newss: docs.map(doc=>{
                return{
                    name: doc.name,
                    address: doc.address,
                    phone: doc.phone,
                    email: doc.email,
                    _id:doc._id,
                    request:{ //show route name
                        type:'GET',
                        url: 'http://localhost:4000/users/'+ doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>{
       console.log(err);
       res.status(500).json({
           error: err
       });
    });
});

router.get('/:usersId', checkAuth,(req,res,next)=>{
    const id = req.params.usersId;
    User.findById(id)
    .select('name email _id address phone')
    .exec()
    .then(
        doc=>{
        if(doc){
            res.status(200).json({
                news: doc,
                request:{
                    type: 'GET',
                    url: 'http://localhost:4000/users'
                }
            });
        } 
        else {
            res.status(404).json({message: 'No vaild entry found for provied ID'});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


router.delete('/:userId',(req,res,next)=>{
    const id = req.params.userId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/users',
                body:{ email:'String', password: 'string'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });    
});

module.exports = router;

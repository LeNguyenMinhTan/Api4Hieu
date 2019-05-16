const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/book');
const User = require('../models/user');
const checkAuth = require('../middleware/check_auth');


router.get('/', checkAuth,(req,res,next)=>{
  Book.find()
  .select('user titleTest _id dateBook descTest location cost')
  .populate('user','name')
  .exec()
  .then(docs=>{
      res.status(200).json({
          count: docs.length,
          books: docs.map(doc=>{
              return{
                  _id: doc._id,
                  user: doc.user,          
                  titleTest: doc.titleTest,
                  dateBook: doc.dateBook,
                  descTest: doc.descTest,
                  location: doc.location,
                  cost: doc.cost,
                  request:{
                      Type: 'GET',
                      url: 'http://localhost:4000/books/'+ doc._id
                  }
              }
          })
      })
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({
          error: err
      })
  })
});
router.post('/', checkAuth,(req,res,next)=>{
    const book = new Book({
        _id: mongoose.Types.ObjectId(),
        titleTest: req.body.titleTest,
        dateBook: req.body.dateBook,
        descTest: req.body.descTest,
        location: req.body.location,
        cost: req.body.cost,
        user: req.body.userId
    })
    User.findById(req.body.userId)
    .then(user => {
        if(!user){
                return res.status(404).json({
                message: "User not found"
            });
        }
        else{
            book.save()
            .then(result =>{
                res.status(201).json({
                    message: 'Book stord',
                    createbook: {
                        _id: result._id,
                        user: result.user,
                        titleTest: result.titleTest,
                        dateBook: result.dateBook,
                        descTest: result.descTest,
                        location: result.location,
                        cost: result.cost
                    },
                    request:{
                        Type: 'GET',
                        url: 'http://localhost:4000/books/'+ result._id
                    }
                })
            })
        }        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });    
});


router.get('/:bookId', checkAuth,(req,res,next)=>{
    Book.findById(req.params.bookId)
    .populate('user')
    .exec()
    .then(Book=>{
        if(!Book)
        {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            Book: Book,
            request:{
                type:'GET',
                url: 'http://localhost:4000/books'
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });    
});

router.delete('/:bookId', checkAuth,(req,res,next)=>{
    const id = req.params.bookId;
    User.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Book deleted',
            request:{
                type:'POST',
                url:'http://localhost:4000/books',
                body:{ userId:'ID', titleTest: 'String'}
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
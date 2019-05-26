const express = require('express');
const router = express.Router();
const News = require('../models/news');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check_auth');


const storage = multer.diskStorage(
  {
    destination: function(req, file, cb){
      cb(null, "uploads");
    },
    filetitle: function(req, file, cb){
      cb(null, Date.now() + file.originaltitle);
    }
  });

function fileFilter(req, file, cb){
  if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const limit = {fileSize: 1024*1024*5};

const upload = multer({ 
    storage: storage, 
    limits: limit, 
    fileFilter: fileFilter 
});


router.get('/newOne', checkAuth,(req,res,next)=>{
    News.find()
    .select("title description _id newsImage created_at")
    .sort({'created_at': -1}).limit(1)
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            Newss: docs.map(doc=>{
                return{
                    title: doc.title,
                    description: doc.description,
                    newsImage: doc.newsImage,
                    _id:doc._id,
                    created_at:doc.created_at,
                    request:{ //show route title
                        type:'GET',
                        url: 'http://localhost:4000/news/'+ doc._id
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

router.get('/', checkAuth,(req,res,next)=>{
    News.find()
    .select("title description _id newsImage created_at")
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            Newss: docs.map(doc=>{
                return{
                    title: doc.title,
                    description: doc.description,
                    newsImage: doc.newsImage,
                    _id:doc._id,
                    created_at:doc.created_at,
                    request:{ //show route title
                        type:'GET',
                        url: 'http://localhost:4000/news/'+ doc._id
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




router.post('/', checkAuth, upload.single('newsImage'),(req,res,next)=>{
    const news = new News({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        newsImage: req.file.path
    })
    
    news.save()
    .then(result=>{
        res.status(201).json({
            message:'Created News successfully',
            createNews:{
                title: result.title,
                description: result.description,
                _id: result._id,
                request:{
                    type:'GET',
                    url: 'http://localhost:4000/news/'+ result._id
                }
            }
        });
    })
    .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
        });
    });
});

router.get('/:newsId', checkAuth,(req,res,next)=>{
    const id = req.params.newsId;
    News.findById(id)
    .select('title description _id newsImage')
    .exec()
    .then(
        doc=>{
        if(doc){
            res.status(200).json({
                news: doc,
                request:{
                    type: 'GET',
                    url: 'http://localhost:4000/news'
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

router.patch('/:newsId', checkAuth,(req,res,next)=>{
    const id = req.params.newsId;
    const updateOps ={};
    for (const ops of req.body){
        updateOps[ops.proptitle] = ops.value;
    }
    News.update({_id:id},{ $set: updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'News updated',
            request:{
                type: 'GET',
                url: 'http://localhost:4000/news/'+ id
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

router.delete('/:newsId', checkAuth,(req,res,next)=>{
    const id = req.params.newsId;
    News.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'News deleted',
            request:{
                type:'POST',
                url:'http://localhost:4000/news',
                body:{ title:'String', description: 'String'}
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


module.exports = router;
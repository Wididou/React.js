const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    var dishesArr=[]
    for(var i=0; i< req.body.length;i++){
        dishesArr.push(req.body[i]._id);
    }
    Favorites.find({user:req.user._id})
    .then((favorite) =>{
        if(favorite!=null){
            favorite.dishes.push(dishesArr);
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
           .catch((err) => next(err));
        }
        else{
            Favorites.create({'user':req.user._id,'dishes':dishesArr})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
                }, (err) => next(err))
            .catch((err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.remove({user:req.user._id})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.find({user:req.user._id})
    .then((favorite)=>{
        if (favorite!=null) { //list of favorite doesnt exist for the user
            for(var i=0; i < favorite.dishes.length ; i++){
                if(req.params.dishId == favorite.dishes[i]._id){
                    const indexDish = i;
                }
            }
            if (indexDish == -1) { //the dish doesnt exists
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                },(err)=>next(err))
                .catch((err) => next(err))
            }
        }
        else{ //user's favorite list exists
            Favorites.create({'user':req.user._id,'dishes':[req.params.dishId]})
            .then((favorite) => { 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    },(err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.find({user:req.user._id})
    .then((favorite) => {
        for(var i=0; i < favorite.dishes.length ; i++){
            if(req.params.dishId == favorite.dishes[i]._id){
                const indexDish = i;
            }
        }
        if (indexDish > -1) {
            favorite.dishes.splice(indexDish, 1);
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err)=>next(err))
            .catch((err) => next(err))
        }
        else{
            err = new Error('This Dish does not exist in your favorite list');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = favoriteRouter;
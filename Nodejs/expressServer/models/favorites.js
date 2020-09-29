const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dishes = require('../models/dishes');

var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, //to be able to use mongoose-population
        ref: 'User'
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish' 
        }  
    ]
}, {
    timestamps: true
});


var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;
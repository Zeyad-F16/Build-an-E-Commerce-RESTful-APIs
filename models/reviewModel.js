const mongoose = require('mongoose');

const productModel = require('./productModel');

const reviewSchema = new mongoose.Schema({
title:{
    type: String,
},
ratings:{
    type: Number,
    min:[1,'    Min ratings value is 1.0'],
    max:[5,'    Min ratings value is 5.0'],
    required:[true,'Review rating is required']
},
user:{
    type: mongoose.Schema.ObjectId,
    ref:'user',
    required: [true,'Review must belong to user'],
},
product:{
    type: mongoose.Schema.ObjectId,
    ref:'product',
    required: [true,'Review must belong to product'],
},
},{timestamps: true});

reviewSchema.pre(/^find/, function (next){
this.populate({path:'user', select:'name'});
next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
const result = await this.aggregate([
// stage 1 : get all reviews in specific product
{ 
   $match : { product : productId } 
},
// stage 2 : Grouping reviews based on productId and calc avgRating and quantity
{
   $group : { 
    _id : 'product' , 
    avgRatings : { $avg : '$ratings' },
    ratingsQuan : { $sum : 1 },
} 
},
]);

if(result.length > 0){
await productModel.findByIdAndUpdate( productId , {
    ratingsAverage : result[0].avgRatings ,
    ratingsQuantity : result[0].ratingsQuan,
})
}
else {
    await productModel.findByIdAndUpdate(productId,{
        ratingsAverage : 0 ,
        ratingsQuantity : 0 ,
});
}
};

reviewSchema.post('save',async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('deleteOne',async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports =  mongoose.model('Review',reviewSchema);
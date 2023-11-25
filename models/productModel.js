const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
title :{
    type : String,
    required : true,
    trim : true,
    minlength : [3,'Too short product title'],
    maxlength : [100,'Too long product title'],
},
slug: {
    type : String,
    required : true,
    lowercase : true,
},
description :{
    type : String,
    required : [true,'product description is required'],
    minlength : [20,'Too short product description'],
},
quantity:{
    type : Number,
    required : [true,'product quantity is required'],
},
sold :{
    type : Number,
    default : 0,
},
price :{
    type : Number,
    trim: true,
    required : [true,'product price is required'],
    max : [2000000,'Too long product price'],
},
priceAfterDiscount:{
    type : Number,
},
colors:[String],
imageCover:{
    type : String,
    required : [true,'product image is required'],
},
images:[String],
category:{
    type : mongoose.Schema.ObjectId,
    ref : 'category',
    required : [true,'product category is required'],
},
subCategory:[{
    type : mongoose.Schema.ObjectId,
    ref : 'subCategory',
}],
brand:{
    type : mongoose.Schema.ObjectId,
    ref : 'brand',
},
ratingsAverage:{
    type : Number,
    min:[1,'Rating must be above or equal 1.0'],
    max:[5,'Rating must be below or equal 5.0'],
},
ratingsQuantity:{
    type : Number,
    default : 0,
}
}
,{timestamps:true,
   // to enable virtual populate
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});

productSchema.virtual('reviews',{
    ref:'Review',
    foreignField :'product',
    localField : '_id'
});

productSchema.pre(/^find/, function(next){
 this.populate({
    path : 'category',
    select : 'name -_id'
 })
 next();
})

const setImageUrl = (doc)=>{
    if(doc.imageCover){
   const  imageURL = `${process.env.BASE_URL}/product/${doc.imageCover}`;
     doc.imageCover = imageURL ;
    }
    if(doc.images){
        const imageList = [];
    doc.images.forEach((image)=>{
        const  imageURL = `${process.env.BASE_URL}/product/${image}`;
        imageList.push(imageURL);
    })
   doc.images = imageList;
    }
}

productSchema.post('init',(doc)=>{
    setImageUrl(doc);
});

productSchema.post('save',(doc)=>{
    setImageUrl(doc);
});

module.exports = mongoose.model('product',productSchema);
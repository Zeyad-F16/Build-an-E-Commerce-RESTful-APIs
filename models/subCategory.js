const mongoose =require('mongoose');

const subCategorySchema = new mongoose.Schema(
{
    name : {
        type : String,
        trim : true, 
        unique : [true,"subcategory must be unique"],
        minlength : [2, "Too short subcategory name"],
        maxlength : [32,"Too long subcategory name"]
    },
    slug : {
        type : String,
        lowercase : true,
    },
    category :{
        type : mongoose.Schema.ObjectId,
        ref:'category',
        required : [true ,"subcategory must be belong to parent category"],
    }
},
{timestamps : true});

module.exports = mongoose.model('subCategory',subCategorySchema);
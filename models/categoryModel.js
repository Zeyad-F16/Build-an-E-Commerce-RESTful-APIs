const mongoose= require('mongoose');

// 1- create schema 
const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"category required"],
        unique : [true,"category must be unique"],
        minlength : [3, "Too short category name"],
        maxlength : [32,"Too long category name"]
    },
    image : String ,
    // A AND B => shoping.com/a-and-b  (url)
    slug : {
        type : String,
        lowercase : true,
    }
    // create two fields in DB (created at (time) , updated at (time) )
},{timestamps:true});

const setImageUrl = (doc)=>{
    if(doc.image){
   const  imageURL = `${process.env.BASE_URL}/category/${doc.image}`;
     doc.image = imageURL ;
    }
}
// work on update , findOne , findAll
CategorySchema.post('init',(doc)=>{
    setImageUrl(doc);
});

// work on create 
CategorySchema.post('save',(doc)=>{
    setImageUrl(doc);
});


// 2- convert schema to model 
const CategoryModel =  mongoose.model("category",CategorySchema);

module.exports = CategoryModel;


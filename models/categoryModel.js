const mongoose= require('mongoose');

const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"category required"],
        unique : [true,"category must be unique"],
        minlength : [3, "Too short category name"],
        maxlength : [32,"Too long category name"]
    },
    image : String ,
    slug : {
        type : String,
        lowercase : true,
    }
},{timestamps:true});

const setImageUrl = (doc)=>{
    if(doc.image){
   const  imageURL = `${process.env.BASE_URL}/category/${doc.image}`;
     doc.image = imageURL ;
    }
};

// work on update,findOne and findAll brands
CategorySchema.post('init',(doc)=>{
    setImageUrl(doc);
});

// work when create brand only 
CategorySchema.post('save',(doc)=>{
    setImageUrl(doc);
});

const CategoryModel =  mongoose.model("category",CategorySchema);
module.exports = CategoryModel;
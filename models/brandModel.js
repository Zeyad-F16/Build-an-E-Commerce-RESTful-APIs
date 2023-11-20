const mongoose= require('mongoose');

// 1- create schema 
const brandSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"brand required"],
        unique : [true,"brand must be unique"],
        minlength : [3, "Too short brand name"],
        maxlength : [32,"Too long brand name"]
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
   const  imageURL = `${process.env.BASE_URL}/brand/${doc.image}`;
     doc.image = imageURL ;
    }
}
// work on update , findOne , findAll
brandSchema.post('init',(doc)=>{
    setImageUrl(doc);
});

// work on create 
brandSchema.post('save',(doc)=>{
    setImageUrl(doc);
});


// 2- convert schema to model 
const brandModel =  mongoose.model("brand",brandSchema);

module.exports = brandModel;
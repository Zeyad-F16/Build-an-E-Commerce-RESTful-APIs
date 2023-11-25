const mongoose= require('mongoose');

const brandSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"brand required"],
        unique : [true,"brand must be unique"],
        minlength : [3, "Too short brand name"],
        maxlength : [32,"Too long brand name"]
    },
    image : String ,
    slug : {
        type : String,
        lowercase : true,
    }
},{timestamps:true});

const setImageUrl = (doc)=>{
    if(doc.image){
   const  imageURL = `${process.env.BASE_URL}/brand/${doc.image}`;
     doc.image = imageURL ;
    }
};

brandSchema.post('init',(doc)=>{
    setImageUrl(doc);
});

brandSchema.post('save',(doc)=>{
    setImageUrl(doc);
});

const brandModel =  mongoose.model("brand",brandSchema);
module.exports = brandModel;
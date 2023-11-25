const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    trim : true,
    required: [true , 'name is required'],
},
slug:{
    type : String,
    lowercase : true,
},
email:{
    type : String,
    required: [true , 'email is required'],
    unique : true,
    lowercase : true,
},
phone : String,
profileImg : String,

password:{
    type: String,
    required: [true , 'password is required'],
    minlength : [6,'Too short password'],
},
passwordChangedAt : Date,
passwordResetCode: String,
passwordResetExpires: Date,
passwordResetVerified: Boolean,
role:{
    type:String ,
    enum :['admin', 'user','manager'],
    default: 'user',
},
active:{
    type : Boolean,
    default: true,
},
// child reference (one to many)
wishlist:[{
type:mongoose.Schema.ObjectId,
ref : 'product'
}],
address:[{
    id : {type: mongoose.Schema.Types.ObjectId},
    alias : String,
    detalis : String,
    phone : String,
    city : String,
    postalcode : String,
}]
},{timestamps: true});

userSchema.pre('save',async function(next){
 // if you want to update a password and you write the same old password
if (!this.isModified('password')) return next(); 
// hashing user password
this.password = await bcrypt.hash(this.password , 12);
next();
});

const User = mongoose.model('user',userSchema);
module.exports = User;
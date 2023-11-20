const multer  = require('multer');
const ApiError = require('../utils/apiError');

// memoryStorage is used when you want to store a file and change the size     
// multerfilter whose function allow images only
// ex : mimetype => image/jpeg

const multerOptions = ()=>{
    const multerStorage = multer.memoryStorage();
    const multerFilter =  function(req, file , cb) {
        if(file.mimetype.startsWith('image')){
            cb(null ,true)
        }
        else{
            cb(new ApiError('only images Allowed',400),false);
        }
    }
    const upload = multer({storage: multerStorage  , fileFilter : multerFilter});
    return upload;
}


exports.uploadSingleImage = (fileName) =>  multerOptions().single(fileName)


exports.uploadMixOfImages = (arrayOfFields)=> multerOptions().fields(arrayOfFields);










// // diskStorage is used when you want to store a file without change the size     
// const multerStorage = multer.diskStorage({
    //     destination: function(req , file , cb){
        //         cb(null ,'uploads/category');
//       //   //cb = callback = next()
// },

// // filename is a function create a file name without duplicate
// filename : function( req ,file , cb){
    
    // // ex : mimetype => image/jpeg    image[0] , jpeg[1] 
    // const ext = file.mimetype.split('/')[1]; 
    
    // // category-${id}-$Date.now().jpeg    (format)
    // const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
    // cb(null ,fileName); 
    // }
    // });
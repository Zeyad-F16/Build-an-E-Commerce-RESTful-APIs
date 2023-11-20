const asyncHandler = require('express-async-handler');
const ApiError=require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getAll = (Model , modelName)=>asyncHandler( async (req,res)=>{
    let filter ={};
    if(req.filterObj){
    filter = req.filterObj;
    }
    
    const documentCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(req.query , Model.find(filter))
    .filter()
    .sort()
    .limitFields()
    .paginate(documentCount)
    .search(modelName);
    
    // Excute query 
    const {mongooseQuery , paginationResult} = apiFeatures ;
    const document = await mongooseQuery;
    res.status(200).json({result : document.length ,paginationResult, data:document});
});


exports.getOne = (Model , populationOpt)=> 
asyncHandler ( async (req,res,next)=>{
    const {id} = req.params;
    // 1- Build query
    let query =  Model.findById(id);
    if (populationOpt){
        query = query.populate(populationOpt);
    }

    // 2- execute query
    const document = await query ;

    if(!document) {
        return next(new ApiError(`No document for this id ${id}`,404))
    }
    res.status(200).json({data : document});
});


exports.createOne = (Model)=>asyncHandler(async (req,res)=>{
    const document = await Model.create(req.body);
    res.status(201).json({data : document});
});


exports.updateOne = (Model) => asyncHandler( async(req,res,next) => {
    const document = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true});
     
        if(!document) {
            return next(new ApiError(`No document for this id ${req.params.id}`,404))
    }
    // Trigger 'save' event when update the document
    document.save();
    res.status(200).json({data : document});
});


exports.deleteOne = (Model) => asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const document = await Model.findByIdAndDelete(id);
                
    if(!document) {
    return next(new ApiError(`No document for this id ${id}`,404))
   }
    // Trigger 'remove' event when update the document
    document.deleteOne()
    res.status(204).send();
 });
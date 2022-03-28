/**
 * BlogController.js
 * @description : exports action methods for Blog.
 */

const Blog = require('../../model/Blog');
const BlogSchemaKey = require('../../utils/validation/BlogValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Blog in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Blog. {status, message, data}
 */ 
const addBlog = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      BlogSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Blog(dataToCreate);
    let createdBlog = await dbService.createDocument(Blog,dataToCreate);
    return res.success({ data : createdBlog });
  } catch (error) {
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : find all documents of Blog from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Blog(s). {status, message, data}
 */
const findAllBlog = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BlogSchemaKey.findFilterKeys,
      Blog.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Blog, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundBlogs = await dbService.getAllDocuments( Blog,query,options);
    if (!foundBlogs || !foundBlogs.data || !foundBlogs.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundBlogs });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Blog.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getBlogCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      BlogSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedBlog = await dbService.countDocument(Blog,where);
    countedBlog = { totalRecords: countedBlog };
    return res.success({ data : countedBlog });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of Blog from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Blog.
 * @return {Object} : number of deactivated documents of Blog. {status, message, data}
 */
const softDeleteManyBlog = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedBlog = await dbService.bulkUpdate(Blog,query, updateBody);
    if (!updatedBlog) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedBlog });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Blog in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Blogs. {status, message, data}
 */
const bulkInsertBlog = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdBlogs = await dbService.bulkInsert(Blog,dataToCreate);
    return res.success({ data :createdBlogs });
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Blog with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Blogs.
 * @return {Object} : updated Blogs. {status, message, data}
 */
const bulkUpdateBlog = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = { ...req.body.data };
    delete dataToUpdate['addedBy'];
    if (typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...dataToUpdate,
        updatedBy : req.user.id
      };
    }
    let result = await dbService.bulkUpdate(Blog,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Blog in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyBlog = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedBlog = await dbService.deleteMany(Blog,query);
    if (!deletedBlog){
      return res.recordNotFound();
    }
    return res.success({ data :deletedBlog });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of Blog from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Blog.
 * @return {Object} : deactivated Blog. {status, message, data}
 */
const softDeleteBlog = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedBlog = await dbService.findOneAndUpdateDocument(Blog, query, updateBody,{ new:true });
    if (!updatedBlog){
      return res.recordNotFound();
    }
    return res.success({ data:updatedBlog });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Blog with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Blog.
 * @return {obj} : updated Blog. {status, message, data}
 */
const partialUpdateBlog = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest();
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      BlogSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBlog = await dbService.findOneAndUpdateDocument(Blog, query, dataToUpdate,{ new:true });
    if (!updatedBlog) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedBlog });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Blog with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Blog.
 * @return {Object} : updated Blog. {status, message, data}
 */
const updateBlog = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      BlogSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBlog = await dbService.findOneAndUpdateDocument(Blog,query,dataToUpdate,{ new:true });
    if (!updatedBlog){
      return res.recordNotFound();
    }
    return res.success({ data :updatedBlog });
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Blog from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Blog. {status, message, data}
 */
const getBlog = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundBlog = await dbService.getSingleDocument(Blog,query, options);
    if (!foundBlog){
      return res.recordNotFound();
    }
    return res.success({ data :foundBlog });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of Blog from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Blog. {status, message, data}
 */
const deleteBlog = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedBlog = await dbService.findOneAndDeleteDocument(Blog, query);
    if (!deletedBlog){
      return res.recordNotFound();
    }
    return res.success({ data :deletedBlog });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addBlog,
  findAllBlog,
  getBlogCount,
  softDeleteManyBlog,
  bulkInsertBlog,
  bulkUpdateBlog,
  deleteManyBlog,
  softDeleteBlog,
  partialUpdateBlog,
  updateBlog,
  getBlog,
  deleteBlog,
};
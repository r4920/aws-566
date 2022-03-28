/**
 * CommentController.js
 * @description : exports action methods for Comment.
 */

const Comment = require('../../model/Comment');
const CommentSchemaKey = require('../../utils/validation/CommentValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Comment in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Comment. {status, message, data}
 */ 
const addComment = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      CommentSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Comment(dataToCreate);
    let createdComment = await dbService.createDocument(Comment,dataToCreate);
    return res.success({ data : createdComment });
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
 * @description : find all documents of Comment from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Comment(s). {status, message, data}
 */
const findAllComment = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CommentSchemaKey.findFilterKeys,
      Comment.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Comment, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundComments = await dbService.getAllDocuments( Comment,query,options);
    if (!foundComments || !foundComments.data || !foundComments.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundComments });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Comment.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCommentCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CommentSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedComment = await dbService.countDocument(Comment,where);
    countedComment = { totalRecords: countedComment };
    return res.success({ data : countedComment });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate multiple documents of Comment from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Comment.
 * @return {Object} : number of deactivated documents of Comment. {status, message, data}
 */
const softDeleteManyComment = async (req,res) => {
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
    let updatedComment = await deleteDependentService.softDeleteComment(query, updateBody);
    if (!updatedComment) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedComment });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Comment in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Comments. {status, message, data}
 */
const bulkInsertComment = async (req,res)=>{
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
    let createdComments = await dbService.bulkInsert(Comment,dataToCreate);
    return res.success({ data :createdComments });
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
 * @description : update multiple records of Comment with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Comments.
 * @return {Object} : updated Comments. {status, message, data}
 */
const bulkUpdateComment = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Comment,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Comment in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyComment = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedComment;
    if (req.body.isWarning) {
      deletedComment = await deleteDependentService.countComment(query);
    }
    else {
      deletedComment = await deleteDependentService.deleteComment(query);
    }
    if (!deletedComment){
      return res.recordNotFound();
    }
    return res.success({ data :deletedComment });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Comment from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Comment.
 * @return {Object} : deactivated Comment. {status, message, data}
 */
const softDeleteComment = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedComment = await deleteDependentService.softDeleteComment(query, updateBody);
    if (!updatedComment){
      return res.recordNotFound();
    }
    return res.success({ data:updatedComment });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Comment with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Comment.
 * @return {obj} : updated Comment. {status, message, data}
 */
const partialUpdateComment = async (req,res) => {
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
      CommentSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedComment = await dbService.findOneAndUpdateDocument(Comment, query, dataToUpdate,{ new:true });
    if (!updatedComment) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedComment });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Comment with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Comment.
 * @return {Object} : updated Comment. {status, message, data}
 */
const updateComment = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CommentSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedComment = await dbService.findOneAndUpdateDocument(Comment,query,dataToUpdate,{ new:true });
    if (!updatedComment){
      return res.recordNotFound();
    }
    return res.success({ data :updatedComment });
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
 * @description : find document of Comment from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Comment. {status, message, data}
 */
const getComment = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundComment = await dbService.getSingleDocument(Comment,query, options);
    if (!foundComment){
      return res.recordNotFound();
    }
    return res.success({ data :foundComment });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Comment from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Comment. {status, message, data}
 */
const deleteComment = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedComment;
    if (req.body.isWarning) { 
      deletedComment = await deleteDependentService.countComment(query);
    } else {
      deletedComment = await deleteDependentService.deleteComment(query);
    }
    if (!deletedComment){
      return res.recordNotFound();
    }
    return res.success({ data :deletedComment });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addComment,
  findAllComment,
  getCommentCount,
  softDeleteManyComment,
  bulkInsertComment,
  bulkUpdateComment,
  deleteManyComment,
  softDeleteComment,
  partialUpdateComment,
  updateComment,
  getComment,
  deleteComment,
};
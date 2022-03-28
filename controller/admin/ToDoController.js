/**
 * ToDoController.js
 * @description : exports action methods for ToDo.
 */

const ToDo = require('../../model/ToDo');
const ToDoSchemaKey = require('../../utils/validation/ToDoValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of ToDo in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created ToDo. {status, message, data}
 */ 
const addToDo = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      ToDoSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new ToDo(dataToCreate);
    let createdToDo = await dbService.createDocument(ToDo,dataToCreate);
    return res.success({ data : createdToDo });
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
 * @description : find all documents of ToDo from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found ToDo(s). {status, message, data}
 */
const findAllToDo = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToDoSchemaKey.findFilterKeys,
      ToDo.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(ToDo, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundToDos = await dbService.getAllDocuments( ToDo,query,options);
    if (!foundToDos || !foundToDos.data || !foundToDos.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundToDos });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of ToDo.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getToDoCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      ToDoSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedToDo = await dbService.countDocument(ToDo,where);
    countedToDo = { totalRecords: countedToDo };
    return res.success({ data : countedToDo });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of ToDo from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of ToDo.
 * @return {Object} : number of deactivated documents of ToDo. {status, message, data}
 */
const softDeleteManyToDo = async (req,res) => {
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
    let updatedToDo = await dbService.bulkUpdate(ToDo,query, updateBody);
    if (!updatedToDo) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedToDo });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of ToDo in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created ToDos. {status, message, data}
 */
const bulkInsertToDo = async (req,res)=>{
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
    let createdToDos = await dbService.bulkInsert(ToDo,dataToCreate);
    return res.success({ data :createdToDos });
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
 * @description : update multiple records of ToDo with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated ToDos.
 * @return {Object} : updated ToDos. {status, message, data}
 */
const bulkUpdateToDo = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(ToDo,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of ToDo in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyToDo = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedToDo = await dbService.deleteMany(ToDo,query);
    if (!deletedToDo){
      return res.recordNotFound();
    }
    return res.success({ data :deletedToDo });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of ToDo from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of ToDo.
 * @return {Object} : deactivated ToDo. {status, message, data}
 */
const softDeleteToDo = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedToDo = await dbService.findOneAndUpdateDocument(ToDo, query, updateBody,{ new:true });
    if (!updatedToDo){
      return res.recordNotFound();
    }
    return res.success({ data:updatedToDo });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of ToDo with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ToDo.
 * @return {obj} : updated ToDo. {status, message, data}
 */
const partialUpdateToDo = async (req,res) => {
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
      ToDoSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedToDo = await dbService.findOneAndUpdateDocument(ToDo, query, dataToUpdate,{ new:true });
    if (!updatedToDo) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedToDo });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of ToDo with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated ToDo.
 * @return {Object} : updated ToDo. {status, message, data}
 */
const updateToDo = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      ToDoSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedToDo = await dbService.findOneAndUpdateDocument(ToDo,query,dataToUpdate,{ new:true });
    if (!updatedToDo){
      return res.recordNotFound();
    }
    return res.success({ data :updatedToDo });
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
 * @description : find document of ToDo from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found ToDo. {status, message, data}
 */
const getToDo = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundToDo = await dbService.getSingleDocument(ToDo,query, options);
    if (!foundToDo){
      return res.recordNotFound();
    }
    return res.success({ data :foundToDo });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of ToDo from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted ToDo. {status, message, data}
 */
const deleteToDo = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedToDo = await dbService.findOneAndDeleteDocument(ToDo, query);
    if (!deletedToDo){
      return res.recordNotFound();
    }
    return res.success({ data :deletedToDo });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addToDo,
  findAllToDo,
  getToDoCount,
  softDeleteManyToDo,
  bulkInsertToDo,
  bulkUpdateToDo,
  deleteManyToDo,
  softDeleteToDo,
  partialUpdateToDo,
  updateToDo,
  getToDo,
  deleteToDo,
};
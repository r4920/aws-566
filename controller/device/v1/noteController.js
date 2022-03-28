/**
 * noteController.js
 * @description : exports action methods for note.
 */

const Note = require('../../../model/note');
const noteSchemaKey = require('../../../utils/validation/noteValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Note in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Note. {status, message, data}
 */ 
const addNote = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      noteSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Note(dataToCreate);
    let createdNote = await dbService.createDocument(Note,dataToCreate);
    return res.success({ data : createdNote });
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
 * @description : find all documents of Note from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Note(s). {status, message, data}
 */
const findAllNote = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      noteSchemaKey.findFilterKeys,
      Note.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Note, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundNotes = await dbService.getAllDocuments( Note,query,options);
    if (!foundNotes || !foundNotes.data || !foundNotes.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundNotes });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Note.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getNoteCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      noteSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedNote = await dbService.countDocument(Note,where);
    countedNote = { totalRecords: countedNote };
    return res.success({ data : countedNote });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of Note from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Note.
 * @return {Object} : number of deactivated documents of Note. {status, message, data}
 */
const softDeleteManyNote = async (req,res) => {
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
    let updatedNote = await dbService.bulkUpdate(Note,query, updateBody);
    if (!updatedNote) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedNote });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Note in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Notes. {status, message, data}
 */
const bulkInsertNote = async (req,res)=>{
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
    let createdNotes = await dbService.bulkInsert(Note,dataToCreate);
    return res.success({ data :createdNotes });
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
 * @description : update multiple records of Note with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Notes.
 * @return {Object} : updated Notes. {status, message, data}
 */
const bulkUpdateNote = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Note,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Note in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyNote = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedNote = await dbService.deleteMany(Note,query);
    if (!deletedNote){
      return res.recordNotFound();
    }
    return res.success({ data :deletedNote });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of Note from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Note.
 * @return {Object} : deactivated Note. {status, message, data}
 */
const softDeleteNote = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedNote = await dbService.findOneAndUpdateDocument(Note, query, updateBody,{ new:true });
    if (!updatedNote){
      return res.recordNotFound();
    }
    return res.success({ data:updatedNote });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Note with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Note.
 * @return {obj} : updated Note. {status, message, data}
 */
const partialUpdateNote = async (req,res) => {
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
      noteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedNote = await dbService.findOneAndUpdateDocument(Note, query, dataToUpdate,{ new:true });
    if (!updatedNote) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedNote });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Note with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Note.
 * @return {Object} : updated Note. {status, message, data}
 */
const updateNote = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      noteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedNote = await dbService.findOneAndUpdateDocument(Note,query,dataToUpdate,{ new:true });
    if (!updatedNote){
      return res.recordNotFound();
    }
    return res.success({ data :updatedNote });
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
 * @description : find document of Note from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Note. {status, message, data}
 */
const getNote = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundNote = await dbService.getSingleDocument(Note,query, options);
    if (!foundNote){
      return res.recordNotFound();
    }
    return res.success({ data :foundNote });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of Note from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Note. {status, message, data}
 */
const deleteNote = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedNote = await dbService.findOneAndDeleteDocument(Note, query);
    if (!deletedNote){
      return res.recordNotFound();
    }
    return res.success({ data :deletedNote });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addNote,
  findAllNote,
  getNoteCount,
  softDeleteManyNote,
  bulkInsertNote,
  bulkUpdateNote,
  deleteManyNote,
  softDeleteNote,
  partialUpdateNote,
  updateNote,
  getNote,
  deleteNote,
};
/**
 * Appointment_scheduleController.js
 * @description : exports action methods for Appointment_schedule.
 */

const Appointment_schedule = require('../../model/Appointment_schedule');
const Appointment_scheduleSchemaKey = require('../../utils/validation/Appointment_scheduleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Appointment_schedule in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Appointment_schedule. {status, message, data}
 */ 
const addAppointment_schedule = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Appointment_scheduleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Appointment_schedule(dataToCreate);
    let createdAppointment_schedule = await dbService.createDocument(Appointment_schedule,dataToCreate);
    return res.success({ data : createdAppointment_schedule });
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
 * @description : find all documents of Appointment_schedule from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Appointment_schedule(s). {status, message, data}
 */
const findAllAppointment_schedule = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Appointment_scheduleSchemaKey.findFilterKeys,
      Appointment_schedule.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Appointment_schedule, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAppointment_schedules = await dbService.getAllDocuments( Appointment_schedule,query,options);
    if (!foundAppointment_schedules || !foundAppointment_schedules.data || !foundAppointment_schedules.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAppointment_schedules });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Appointment_schedule.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAppointment_scheduleCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Appointment_scheduleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAppointment_schedule = await dbService.countDocument(Appointment_schedule,where);
    countedAppointment_schedule = { totalRecords: countedAppointment_schedule };
    return res.success({ data : countedAppointment_schedule });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of Appointment_schedule from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Appointment_schedule.
 * @return {Object} : number of deactivated documents of Appointment_schedule. {status, message, data}
 */
const softDeleteManyAppointment_schedule = async (req,res) => {
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
    let updatedAppointment_schedule = await dbService.bulkUpdate(Appointment_schedule,query, updateBody);
    if (!updatedAppointment_schedule) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_schedule });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Appointment_schedule in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Appointment_schedules. {status, message, data}
 */
const bulkInsertAppointment_schedule = async (req,res)=>{
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
    let createdAppointment_schedules = await dbService.bulkInsert(Appointment_schedule,dataToCreate);
    return res.success({ data :createdAppointment_schedules });
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
 * @description : update multiple records of Appointment_schedule with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Appointment_schedules.
 * @return {Object} : updated Appointment_schedules. {status, message, data}
 */
const bulkUpdateAppointment_schedule = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Appointment_schedule,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Appointment_schedule in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyAppointment_schedule = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedAppointment_schedule = await dbService.deleteMany(Appointment_schedule,query);
    if (!deletedAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAppointment_schedule });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of Appointment_schedule from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Appointment_schedule.
 * @return {Object} : deactivated Appointment_schedule. {status, message, data}
 */
const softDeleteAppointment_schedule = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAppointment_schedule = await dbService.findOneAndUpdateDocument(Appointment_schedule, query, updateBody,{ new:true });
    if (!updatedAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_schedule });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Appointment_schedule with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Appointment_schedule.
 * @return {obj} : updated Appointment_schedule. {status, message, data}
 */
const partialUpdateAppointment_schedule = async (req,res) => {
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
      Appointment_scheduleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAppointment_schedule = await dbService.findOneAndUpdateDocument(Appointment_schedule, query, dataToUpdate,{ new:true });
    if (!updatedAppointment_schedule) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_schedule });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Appointment_schedule with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_schedule.
 * @return {Object} : updated Appointment_schedule. {status, message, data}
 */
const updateAppointment_schedule = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Appointment_scheduleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAppointment_schedule = await dbService.findOneAndUpdateDocument(Appointment_schedule,query,dataToUpdate,{ new:true });
    if (!updatedAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAppointment_schedule });
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
 * @description : find document of Appointment_schedule from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Appointment_schedule. {status, message, data}
 */
const getAppointment_schedule = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAppointment_schedule = await dbService.getSingleDocument(Appointment_schedule,query, options);
    if (!foundAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data :foundAppointment_schedule });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of Appointment_schedule from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Appointment_schedule. {status, message, data}
 */
const deleteAppointment_schedule = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedAppointment_schedule = await dbService.findOneAndDeleteDocument(Appointment_schedule, query);
    if (!deletedAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAppointment_schedule });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addAppointment_schedule,
  findAllAppointment_schedule,
  getAppointment_scheduleCount,
  softDeleteManyAppointment_schedule,
  bulkInsertAppointment_schedule,
  bulkUpdateAppointment_schedule,
  deleteManyAppointment_schedule,
  softDeleteAppointment_schedule,
  partialUpdateAppointment_schedule,
  updateAppointment_schedule,
  getAppointment_schedule,
  deleteAppointment_schedule,
};
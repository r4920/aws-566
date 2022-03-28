/**
 * Appointment_slotController.js
 * @description : exports action methods for Appointment_slot.
 */

const Appointment_slot = require('../../model/Appointment_slot');
const Appointment_slotSchemaKey = require('../../utils/validation/Appointment_slotValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Appointment_slot in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Appointment_slot. {status, message, data}
 */ 
const addAppointment_slot = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Appointment_slotSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Appointment_slot(dataToCreate);
    let createdAppointment_slot = await dbService.createDocument(Appointment_slot,dataToCreate);
    return res.success({ data : createdAppointment_slot });
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
 * @description : find all documents of Appointment_slot from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Appointment_slot(s). {status, message, data}
 */
const findAllAppointment_slot = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Appointment_slotSchemaKey.findFilterKeys,
      Appointment_slot.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Appointment_slot, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAppointment_slots = await dbService.getAllDocuments( Appointment_slot,query,options);
    if (!foundAppointment_slots || !foundAppointment_slots.data || !foundAppointment_slots.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAppointment_slots });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Appointment_slot.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAppointment_slotCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      Appointment_slotSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAppointment_slot = await dbService.countDocument(Appointment_slot,where);
    countedAppointment_slot = { totalRecords: countedAppointment_slot };
    return res.success({ data : countedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate multiple documents of Appointment_slot from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Appointment_slot.
 * @return {Object} : number of deactivated documents of Appointment_slot. {status, message, data}
 */
const softDeleteManyAppointment_slot = async (req,res) => {
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
    let updatedAppointment_slot = await deleteDependentService.softDeleteAppointment_slot(query, updateBody);
    if (!updatedAppointment_slot) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Appointment_slot in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Appointment_slots. {status, message, data}
 */
const bulkInsertAppointment_slot = async (req,res)=>{
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
    let createdAppointment_slots = await dbService.bulkInsert(Appointment_slot,dataToCreate);
    return res.success({ data :createdAppointment_slots });
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
 * @description : update multiple records of Appointment_slot with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Appointment_slots.
 * @return {Object} : updated Appointment_slots. {status, message, data}
 */
const bulkUpdateAppointment_slot = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Appointment_slot,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Appointment_slot in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyAppointment_slot = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedAppointment_slot;
    if (req.body.isWarning) {
      deletedAppointment_slot = await deleteDependentService.countAppointment_slot(query);
    }
    else {
      deletedAppointment_slot = await deleteDependentService.deleteAppointment_slot(query);
    }
    if (!deletedAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Appointment_slot from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Appointment_slot.
 * @return {Object} : deactivated Appointment_slot. {status, message, data}
 */
const softDeleteAppointment_slot = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAppointment_slot = await deleteDependentService.softDeleteAppointment_slot(query, updateBody);
    if (!updatedAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Appointment_slot with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Appointment_slot.
 * @return {obj} : updated Appointment_slot. {status, message, data}
 */
const partialUpdateAppointment_slot = async (req,res) => {
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
      Appointment_slotSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAppointment_slot = await dbService.findOneAndUpdateDocument(Appointment_slot, query, dataToUpdate,{ new:true });
    if (!updatedAppointment_slot) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Appointment_slot with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_slot.
 * @return {Object} : updated Appointment_slot. {status, message, data}
 */
const updateAppointment_slot = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Appointment_slotSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAppointment_slot = await dbService.findOneAndUpdateDocument(Appointment_slot,query,dataToUpdate,{ new:true });
    if (!updatedAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAppointment_slot });
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
 * @description : find document of Appointment_slot from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Appointment_slot. {status, message, data}
 */
const getAppointment_slot = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAppointment_slot = await dbService.getSingleDocument(Appointment_slot,query, options);
    if (!foundAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data :foundAppointment_slot });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Appointment_slot from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Appointment_slot. {status, message, data}
 */
const deleteAppointment_slot = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedAppointment_slot;
    if (req.body.isWarning) { 
      deletedAppointment_slot = await deleteDependentService.countAppointment_slot(query);
    } else {
      deletedAppointment_slot = await deleteDependentService.deleteAppointment_slot(query);
    }
    if (!deletedAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAppointment_slot });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addAppointment_slot,
  findAllAppointment_slot,
  getAppointment_slotCount,
  softDeleteManyAppointment_slot,
  bulkInsertAppointment_slot,
  bulkUpdateAppointment_slot,
  deleteManyAppointment_slot,
  softDeleteAppointment_slot,
  partialUpdateAppointment_slot,
  updateAppointment_slot,
  getAppointment_slot,
  deleteAppointment_slot,
};
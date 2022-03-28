/**
 * patientController.js
 * @description : exports action methods for patient.
 */

const Patient = require('../../model/patient');
const patientSchemaKey = require('../../utils/validation/patientValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Patient in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Patient. {status, message, data}
 */ 
const addPatient = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      patientSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Patient(dataToCreate);
    let createdPatient = await dbService.createDocument(Patient,dataToCreate);
    return res.success({ data : createdPatient });
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
 * @description : find all documents of Patient from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Patient(s). {status, message, data}
 */
const findAllPatient = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      patientSchemaKey.findFilterKeys,
      Patient.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Patient, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundPatients = await dbService.getAllDocuments( Patient,query,options);
    if (!foundPatients || !foundPatients.data || !foundPatients.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundPatients });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Patient.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getPatientCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      patientSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedPatient = await dbService.countDocument(Patient,where);
    countedPatient = { totalRecords: countedPatient };
    return res.success({ data : countedPatient });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate multiple documents of Patient from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Patient.
 * @return {Object} : number of deactivated documents of Patient. {status, message, data}
 */
const softDeleteManyPatient = async (req,res) => {
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
    let updatedPatient = await deleteDependentService.softDeletePatient(query, updateBody);
    if (!updatedPatient) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPatient });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Patient in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Patients. {status, message, data}
 */
const bulkInsertPatient = async (req,res)=>{
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
    let createdPatients = await dbService.bulkInsert(Patient,dataToCreate);
    return res.success({ data :createdPatients });
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
 * @description : update multiple records of Patient with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Patients.
 * @return {Object} : updated Patients. {status, message, data}
 */
const bulkUpdatePatient = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Patient,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Patient in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyPatient = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedPatient;
    if (req.body.isWarning) {
      deletedPatient = await deleteDependentService.countPatient(query);
    }
    else {
      deletedPatient = await deleteDependentService.deletePatient(query);
    }
    if (!deletedPatient){
      return res.recordNotFound();
    }
    return res.success({ data :deletedPatient });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Patient from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Patient.
 * @return {Object} : deactivated Patient. {status, message, data}
 */
const softDeletePatient = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedPatient = await deleteDependentService.softDeletePatient(query, updateBody);
    if (!updatedPatient){
      return res.recordNotFound();
    }
    return res.success({ data:updatedPatient });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Patient with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Patient.
 * @return {obj} : updated Patient. {status, message, data}
 */
const partialUpdatePatient = async (req,res) => {
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
      patientSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPatient = await dbService.findOneAndUpdateDocument(Patient, query, dataToUpdate,{ new:true });
    if (!updatedPatient) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPatient });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Patient with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Patient.
 * @return {Object} : updated Patient. {status, message, data}
 */
const updatePatient = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      patientSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPatient = await dbService.findOneAndUpdateDocument(Patient,query,dataToUpdate,{ new:true });
    if (!updatedPatient){
      return res.recordNotFound();
    }
    return res.success({ data :updatedPatient });
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
 * @description : find document of Patient from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Patient. {status, message, data}
 */
const getPatient = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundPatient = await dbService.getSingleDocument(Patient,query, options);
    if (!foundPatient){
      return res.recordNotFound();
    }
    return res.success({ data :foundPatient });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Patient from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Patient. {status, message, data}
 */
const deletePatient = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedPatient;
    if (req.body.isWarning) { 
      deletedPatient = await deleteDependentService.countPatient(query);
    } else {
      deletedPatient = await deleteDependentService.deletePatient(query);
    }
    if (!deletedPatient){
      return res.recordNotFound();
    }
    return res.success({ data :deletedPatient });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addPatient,
  findAllPatient,
  getPatientCount,
  softDeleteManyPatient,
  bulkInsertPatient,
  bulkUpdatePatient,
  deleteManyPatient,
  softDeletePatient,
  partialUpdatePatient,
  updatePatient,
  getPatient,
  deletePatient,
};
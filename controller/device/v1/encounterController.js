/**
 * encounterController.js
 * @description : exports action methods for encounter.
 */

const Encounter = require('../../../model/encounter');
const encounterSchemaKey = require('../../../utils/validation/encounterValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Encounter in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Encounter. {status, message, data}
 */ 
const addEncounter = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      encounterSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Encounter(dataToCreate);
    let createdEncounter = await dbService.createDocument(Encounter,dataToCreate);
    return res.success({ data : createdEncounter });
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
 * @description : find all documents of Encounter from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Encounter(s). {status, message, data}
 */
const findAllEncounter = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      encounterSchemaKey.findFilterKeys,
      Encounter.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Encounter, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundEncounters = await dbService.getAllDocuments( Encounter,query,options);
    if (!foundEncounters || !foundEncounters.data || !foundEncounters.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundEncounters });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Encounter.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getEncounterCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      encounterSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedEncounter = await dbService.countDocument(Encounter,where);
    countedEncounter = { totalRecords: countedEncounter };
    return res.success({ data : countedEncounter });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate multiple documents of Encounter from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Encounter.
 * @return {Object} : number of deactivated documents of Encounter. {status, message, data}
 */
const softDeleteManyEncounter = async (req,res) => {
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
    let updatedEncounter = await deleteDependentService.softDeleteEncounter(query, updateBody);
    if (!updatedEncounter) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEncounter });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Encounter in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Encounters. {status, message, data}
 */
const bulkInsertEncounter = async (req,res)=>{
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
    let createdEncounters = await dbService.bulkInsert(Encounter,dataToCreate);
    return res.success({ data :createdEncounters });
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
 * @description : update multiple records of Encounter with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Encounters.
 * @return {Object} : updated Encounters. {status, message, data}
 */
const bulkUpdateEncounter = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Encounter,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Encounter in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyEncounter = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedEncounter;
    if (req.body.isWarning) {
      deletedEncounter = await deleteDependentService.countEncounter(query);
    }
    else {
      deletedEncounter = await deleteDependentService.deleteEncounter(query);
    }
    if (!deletedEncounter){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEncounter });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Encounter from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Encounter.
 * @return {Object} : deactivated Encounter. {status, message, data}
 */
const softDeleteEncounter = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedEncounter = await deleteDependentService.softDeleteEncounter(query, updateBody);
    if (!updatedEncounter){
      return res.recordNotFound();
    }
    return res.success({ data:updatedEncounter });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Encounter with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Encounter.
 * @return {obj} : updated Encounter. {status, message, data}
 */
const partialUpdateEncounter = async (req,res) => {
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
      encounterSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEncounter = await dbService.findOneAndUpdateDocument(Encounter, query, dataToUpdate,{ new:true });
    if (!updatedEncounter) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEncounter });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Encounter with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Encounter.
 * @return {Object} : updated Encounter. {status, message, data}
 */
const updateEncounter = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      encounterSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEncounter = await dbService.findOneAndUpdateDocument(Encounter,query,dataToUpdate,{ new:true });
    if (!updatedEncounter){
      return res.recordNotFound();
    }
    return res.success({ data :updatedEncounter });
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
 * @description : find document of Encounter from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Encounter. {status, message, data}
 */
const getEncounter = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundEncounter = await dbService.getSingleDocument(Encounter,query, options);
    if (!foundEncounter){
      return res.recordNotFound();
    }
    return res.success({ data :foundEncounter });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Encounter from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Encounter. {status, message, data}
 */
const deleteEncounter = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedEncounter;
    if (req.body.isWarning) { 
      deletedEncounter = await deleteDependentService.countEncounter(query);
    } else {
      deletedEncounter = await deleteDependentService.deleteEncounter(query);
    }
    if (!deletedEncounter){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEncounter });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addEncounter,
  findAllEncounter,
  getEncounterCount,
  softDeleteManyEncounter,
  bulkInsertEncounter,
  bulkUpdateEncounter,
  deleteManyEncounter,
  softDeleteEncounter,
  partialUpdateEncounter,
  updateEncounter,
  getEncounter,
  deleteEncounter,
};
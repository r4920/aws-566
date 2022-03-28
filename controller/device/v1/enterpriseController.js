/**
 * enterpriseController.js
 * @description : exports action methods for enterprise.
 */

const Enterprise = require('../../../model/enterprise');
const enterpriseSchemaKey = require('../../../utils/validation/enterpriseValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Enterprise in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Enterprise. {status, message, data}
 */ 
const addEnterprise = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      enterpriseSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Enterprise(dataToCreate);
    let createdEnterprise = await dbService.createDocument(Enterprise,dataToCreate);
    return res.success({ data : createdEnterprise });
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
 * @description : find all documents of Enterprise from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Enterprise(s). {status, message, data}
 */
const findAllEnterprise = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      enterpriseSchemaKey.findFilterKeys,
      Enterprise.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Enterprise, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundEnterprises = await dbService.getAllDocuments( Enterprise,query,options);
    if (!foundEnterprises || !foundEnterprises.data || !foundEnterprises.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundEnterprises });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Enterprise.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getEnterpriseCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      enterpriseSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedEnterprise = await dbService.countDocument(Enterprise,where);
    countedEnterprise = { totalRecords: countedEnterprise };
    return res.success({ data : countedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate multiple documents of Enterprise from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Enterprise.
 * @return {Object} : number of deactivated documents of Enterprise. {status, message, data}
 */
const softDeleteManyEnterprise = async (req,res) => {
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
    let updatedEnterprise = await deleteDependentService.softDeleteEnterprise(query, updateBody);
    if (!updatedEnterprise) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Enterprise in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Enterprises. {status, message, data}
 */
const bulkInsertEnterprise = async (req,res)=>{
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
    let createdEnterprises = await dbService.bulkInsert(Enterprise,dataToCreate);
    return res.success({ data :createdEnterprises });
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
 * @description : update multiple records of Enterprise with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Enterprises.
 * @return {Object} : updated Enterprises. {status, message, data}
 */
const bulkUpdateEnterprise = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Enterprise,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Enterprise in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyEnterprise = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedEnterprise;
    if (req.body.isWarning) {
      deletedEnterprise = await deleteDependentService.countEnterprise(query);
    }
    else {
      deletedEnterprise = await deleteDependentService.deleteEnterprise(query);
    }
    if (!deletedEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Enterprise from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Enterprise.
 * @return {Object} : deactivated Enterprise. {status, message, data}
 */
const softDeleteEnterprise = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedEnterprise = await deleteDependentService.softDeleteEnterprise(query, updateBody);
    if (!updatedEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data:updatedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Enterprise with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Enterprise.
 * @return {obj} : updated Enterprise. {status, message, data}
 */
const partialUpdateEnterprise = async (req,res) => {
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
      enterpriseSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEnterprise = await dbService.findOneAndUpdateDocument(Enterprise, query, dataToUpdate,{ new:true });
    if (!updatedEnterprise) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Enterprise with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Enterprise.
 * @return {Object} : updated Enterprise. {status, message, data}
 */
const updateEnterprise = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      enterpriseSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEnterprise = await dbService.findOneAndUpdateDocument(Enterprise,query,dataToUpdate,{ new:true });
    if (!updatedEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data :updatedEnterprise });
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
 * @description : find document of Enterprise from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Enterprise. {status, message, data}
 */
const getEnterprise = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundEnterprise = await dbService.getSingleDocument(Enterprise,query, options);
    if (!foundEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data :foundEnterprise });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Enterprise from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Enterprise. {status, message, data}
 */
const deleteEnterprise = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedEnterprise;
    if (req.body.isWarning) { 
      deletedEnterprise = await deleteDependentService.countEnterprise(query);
    } else {
      deletedEnterprise = await deleteDependentService.deleteEnterprise(query);
    }
    if (!deletedEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEnterprise });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addEnterprise,
  findAllEnterprise,
  getEnterpriseCount,
  softDeleteManyEnterprise,
  bulkInsertEnterprise,
  bulkUpdateEnterprise,
  deleteManyEnterprise,
  softDeleteEnterprise,
  partialUpdateEnterprise,
  updateEnterprise,
  getEnterprise,
  deleteEnterprise,
};
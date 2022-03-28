/**
 * CustomerController.js
 * @description : exports action methods for Customer.
 */

const Customer = require('../../model/Customer');
const CustomerSchemaKey = require('../../utils/validation/CustomerValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Customer in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Customer. {status, message, data}
 */ 
const addCustomer = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      CustomerSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Customer(dataToCreate);
    let createdCustomer = await dbService.createDocument(Customer,dataToCreate);
    return res.success({ data : createdCustomer });
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
 * @description : find all documents of Customer from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Customer(s). {status, message, data}
 */
const findAllCustomer = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CustomerSchemaKey.findFilterKeys,
      Customer.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Customer, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundCustomers = await dbService.getAllDocuments( Customer,query,options);
    if (!foundCustomers || !foundCustomers.data || !foundCustomers.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundCustomers });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Customer.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCustomerCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      CustomerSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedCustomer = await dbService.countDocument(Customer,where);
    countedCustomer = { totalRecords: countedCustomer };
    return res.success({ data : countedCustomer });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of Customer from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Customer.
 * @return {Object} : number of deactivated documents of Customer. {status, message, data}
 */
const softDeleteManyCustomer = async (req,res) => {
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
    let updatedCustomer = await dbService.bulkUpdate(Customer,query, updateBody);
    if (!updatedCustomer) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCustomer });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Customer in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Customers. {status, message, data}
 */
const bulkInsertCustomer = async (req,res)=>{
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
    let createdCustomers = await dbService.bulkInsert(Customer,dataToCreate);
    return res.success({ data :createdCustomers });
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
 * @description : update multiple records of Customer with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Customers.
 * @return {Object} : updated Customers. {status, message, data}
 */
const bulkUpdateCustomer = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Customer,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Customer in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyCustomer = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedCustomer = await dbService.deleteMany(Customer,query);
    if (!deletedCustomer){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCustomer });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of Customer from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Customer.
 * @return {Object} : deactivated Customer. {status, message, data}
 */
const softDeleteCustomer = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedCustomer = await dbService.findOneAndUpdateDocument(Customer, query, updateBody,{ new:true });
    if (!updatedCustomer){
      return res.recordNotFound();
    }
    return res.success({ data:updatedCustomer });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Customer with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Customer.
 * @return {obj} : updated Customer. {status, message, data}
 */
const partialUpdateCustomer = async (req,res) => {
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
      CustomerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCustomer = await dbService.findOneAndUpdateDocument(Customer, query, dataToUpdate,{ new:true });
    if (!updatedCustomer) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCustomer });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Customer with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Customer.
 * @return {Object} : updated Customer. {status, message, data}
 */
const updateCustomer = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CustomerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCustomer = await dbService.findOneAndUpdateDocument(Customer,query,dataToUpdate,{ new:true });
    if (!updatedCustomer){
      return res.recordNotFound();
    }
    return res.success({ data :updatedCustomer });
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
 * @description : find document of Customer from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Customer. {status, message, data}
 */
const getCustomer = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundCustomer = await dbService.getSingleDocument(Customer,query, options);
    if (!foundCustomer){
      return res.recordNotFound();
    }
    return res.success({ data :foundCustomer });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of Customer from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Customer. {status, message, data}
 */
const deleteCustomer = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedCustomer = await dbService.findOneAndDeleteDocument(Customer, query);
    if (!deletedCustomer){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCustomer });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addCustomer,
  findAllCustomer,
  getCustomerCount,
  softDeleteManyCustomer,
  bulkInsertCustomer,
  bulkUpdateCustomer,
  deleteManyCustomer,
  softDeleteCustomer,
  partialUpdateCustomer,
  updateCustomer,
  getCustomer,
  deleteCustomer,
};
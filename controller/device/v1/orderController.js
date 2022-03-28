/**
 * orderController.js
 * @description : exports action methods for order.
 */

const Order = require('../../../model/order');
const orderSchemaKey = require('../../../utils/validation/orderValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Order in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Order. {status, message, data}
 */ 
const addOrder = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      orderSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Order(dataToCreate);
    let createdOrder = await dbService.createDocument(Order,dataToCreate);
    return res.success({ data : createdOrder });
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
 * @description : find all documents of Order from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Order(s). {status, message, data}
 */
const findAllOrder = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      orderSchemaKey.findFilterKeys,
      Order.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Order, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundOrders = await dbService.getAllDocuments( Order,query,options);
    if (!foundOrders || !foundOrders.data || !foundOrders.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundOrders });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Order.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getOrderCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      orderSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedOrder = await dbService.countDocument(Order,where);
    countedOrder = { totalRecords: countedOrder };
    return res.success({ data : countedOrder });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of Order from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Order.
 * @return {Object} : number of deactivated documents of Order. {status, message, data}
 */
const softDeleteManyOrder = async (req,res) => {
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
    let updatedOrder = await dbService.bulkUpdate(Order,query, updateBody);
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrder });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Order in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Orders. {status, message, data}
 */
const bulkInsertOrder = async (req,res)=>{
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
    let createdOrders = await dbService.bulkInsert(Order,dataToCreate);
    return res.success({ data :createdOrders });
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
 * @description : update multiple records of Order with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Orders.
 * @return {Object} : updated Orders. {status, message, data}
 */
const bulkUpdateOrder = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Order,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Order in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyOrder = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedOrder = await dbService.deleteMany(Order,query);
    if (!deletedOrder){
      return res.recordNotFound();
    }
    return res.success({ data :deletedOrder });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of Order from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Order.
 * @return {Object} : deactivated Order. {status, message, data}
 */
const softDeleteOrder = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedOrder = await dbService.findOneAndUpdateDocument(Order, query, updateBody,{ new:true });
    if (!updatedOrder){
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrder });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Order with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Order.
 * @return {obj} : updated Order. {status, message, data}
 */
const partialUpdateOrder = async (req,res) => {
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
      orderSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrder = await dbService.findOneAndUpdateDocument(Order, query, dataToUpdate,{ new:true });
    if (!updatedOrder) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrder });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Order with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Order.
 * @return {Object} : updated Order. {status, message, data}
 */
const updateOrder = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      orderSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrder = await dbService.findOneAndUpdateDocument(Order,query,dataToUpdate,{ new:true });
    if (!updatedOrder){
      return res.recordNotFound();
    }
    return res.success({ data :updatedOrder });
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
 * @description : find document of Order from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Order. {status, message, data}
 */
const getOrder = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundOrder = await dbService.getSingleDocument(Order,query, options);
    if (!foundOrder){
      return res.recordNotFound();
    }
    return res.success({ data :foundOrder });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of Order from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Order. {status, message, data}
 */
const deleteOrder = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedOrder = await dbService.findOneAndDeleteDocument(Order, query);
    if (!deletedOrder){
      return res.recordNotFound();
    }
    return res.success({ data :deletedOrder });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addOrder,
  findAllOrder,
  getOrderCount,
  softDeleteManyOrder,
  bulkInsertOrder,
  bulkUpdateOrder,
  deleteManyOrder,
  softDeleteOrder,
  partialUpdateOrder,
  updateOrder,
  getOrder,
  deleteOrder,
};
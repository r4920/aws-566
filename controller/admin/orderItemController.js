/**
 * orderItemController.js
 * @description : exports action methods for orderItem.
 */

const OrderItem = require('../../model/orderItem');
const orderItemSchemaKey = require('../../utils/validation/orderItemValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of OrderItem in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created OrderItem. {status, message, data}
 */ 
const addOrderItem = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      orderItemSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new OrderItem(dataToCreate);
    let createdOrderItem = await dbService.createDocument(OrderItem,dataToCreate);
    return res.success({ data : createdOrderItem });
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
 * @description : find all documents of OrderItem from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found OrderItem(s). {status, message, data}
 */
const findAllOrderItem = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      orderItemSchemaKey.findFilterKeys,
      OrderItem.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(OrderItem, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundOrderItems = await dbService.getAllDocuments( OrderItem,query,options);
    if (!foundOrderItems || !foundOrderItems.data || !foundOrderItems.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundOrderItems });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of OrderItem.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getOrderItemCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      orderItemSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedOrderItem = await dbService.countDocument(OrderItem,where);
    countedOrderItem = { totalRecords: countedOrderItem };
    return res.success({ data : countedOrderItem });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : deactivate multiple documents of OrderItem from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of OrderItem.
 * @return {Object} : number of deactivated documents of OrderItem. {status, message, data}
 */
const softDeleteManyOrderItem = async (req,res) => {
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
    let updatedOrderItem = await dbService.bulkUpdate(OrderItem,query, updateBody);
    if (!updatedOrderItem) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrderItem });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of OrderItem in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created OrderItems. {status, message, data}
 */
const bulkInsertOrderItem = async (req,res)=>{
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
    let createdOrderItems = await dbService.bulkInsert(OrderItem,dataToCreate);
    return res.success({ data :createdOrderItems });
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
 * @description : update multiple records of OrderItem with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated OrderItems.
 * @return {Object} : updated OrderItems. {status, message, data}
 */
const bulkUpdateOrderItem = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(OrderItem,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of OrderItem in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyOrderItem = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedOrderItem = await dbService.deleteMany(OrderItem,query);
    if (!deletedOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data :deletedOrderItem });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of OrderItem from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of OrderItem.
 * @return {Object} : deactivated OrderItem. {status, message, data}
 */
const softDeleteOrderItem = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedOrderItem = await dbService.findOneAndUpdateDocument(OrderItem, query, updateBody,{ new:true });
    if (!updatedOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrderItem });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of OrderItem with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated OrderItem.
 * @return {obj} : updated OrderItem. {status, message, data}
 */
const partialUpdateOrderItem = async (req,res) => {
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
      orderItemSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrderItem = await dbService.findOneAndUpdateDocument(OrderItem, query, dataToUpdate,{ new:true });
    if (!updatedOrderItem) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrderItem });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of OrderItem with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated OrderItem.
 * @return {Object} : updated OrderItem. {status, message, data}
 */
const updateOrderItem = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      orderItemSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrderItem = await dbService.findOneAndUpdateDocument(OrderItem,query,dataToUpdate,{ new:true });
    if (!updatedOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data :updatedOrderItem });
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
 * @description : find document of OrderItem from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found OrderItem. {status, message, data}
 */
const getOrderItem = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundOrderItem = await dbService.getSingleDocument(OrderItem,query, options);
    if (!foundOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data :foundOrderItem });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of OrderItem from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted OrderItem. {status, message, data}
 */
const deleteOrderItem = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedOrderItem = await dbService.findOneAndDeleteDocument(OrderItem, query);
    if (!deletedOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data :deletedOrderItem });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addOrderItem,
  findAllOrderItem,
  getOrderItemCount,
  softDeleteManyOrderItem,
  bulkInsertOrderItem,
  bulkUpdateOrderItem,
  deleteManyOrderItem,
  softDeleteOrderItem,
  partialUpdateOrderItem,
  updateOrderItem,
  getOrderItem,
  deleteOrderItem,
};
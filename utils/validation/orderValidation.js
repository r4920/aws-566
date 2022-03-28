/**
 * orderValidation.js
 * @description :: validate each post and put request as per order model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of order */
exports.schemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  patientId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
  orderBy: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  note: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of order for updation */
exports.updateSchemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  patientId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
  orderBy: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  note: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of order for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      orderId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      patientId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      status: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      orderBy: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      note: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDelete: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

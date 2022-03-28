/**
 * orderItemValidation.js
 * @description :: validate each post and put request as per orderItem model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of orderItem */
exports.schemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  item: joi.string().allow(null).allow(''),
  uom: joi.string().allow(null).allow(''),
  qty: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of orderItem for updation */
exports.updateSchemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  item: joi.string().allow(null).allow(''),
  uom: joi.string().allow(null).allow(''),
  qty: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of orderItem for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      orderId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      item: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      uom: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      qty: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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

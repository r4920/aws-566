/**
 * departmentsValidation.js
 * @description :: validate each post and put request as per departments model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of departments */
exports.schemaKeys = joi.object({
  name: joi.string().required(),
  code: joi.string().required(),
  enterprises: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  website: joi.string().allow(null).allow(''),
  address: joi.string().required(),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of departments for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  code: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  enterprises: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  website: joi.string().allow(null).allow(''),
  address: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of departments for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      code: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      enterprises: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      phone: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      website: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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

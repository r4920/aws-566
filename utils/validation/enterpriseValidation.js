/**
 * enterpriseValidation.js
 * @description :: validate each post and put request as per enterprise model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of enterprise */
exports.schemaKeys = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().allow(null).allow(''),
  code: joi.string().required(),
  address: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  website: joi.string().regex(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/).allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of enterprise for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  email: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  phone: joi.string().allow(null).allow(''),
  code: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  address: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  website: joi.string().regex(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/).allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of enterprise for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      phone: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      code: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      website: joi.alternatives().try(joi.array().items(),joi.string().regex(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),joi.object()),
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

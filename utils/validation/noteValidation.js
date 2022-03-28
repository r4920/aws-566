/**
 * noteValidation.js
 * @description :: validate each post and put request as per note model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of note */
exports.schemaKeys = joi.object({
  encounterId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  provider: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  text: joi.string().required(),
  isActive: joi.boolean().default(true),
  isDelete: joi.boolean().default(false),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of note for updation */
exports.updateSchemaKeys = joi.object({
  encounterId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  provider: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  text: joi.string().when({
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
/** validation keys and properties of note for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      encounterId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      provider: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      text: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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

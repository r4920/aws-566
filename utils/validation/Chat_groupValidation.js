/**
 * Chat_groupValidation.js
 * @description :: validate each post and put request as per Chat_group model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Chat_group */
exports.schemaKeys = joi.object({
  name: joi.string().required(),
  code: joi.string().required(),
  admin: joi.string().required(),
  member: joi.array().items(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Chat_group for updation */
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
  admin: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  member: joi.array().items(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Chat_group for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      code: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      admin: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      member: joi.alternatives().try(joi.array().items(),joi.array().items(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

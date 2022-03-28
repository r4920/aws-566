/**
 * Chat_messageValidation.js
 * @description :: validate each post and put request as per Chat_message model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Chat_message */
exports.schemaKeys = joi.object({
  message: joi.string().required(),
  sender: joi.string().required(),
  recipient: joi.string().required(),
  groupId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Chat_message for updation */
exports.updateSchemaKeys = joi.object({
  message: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  sender: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  recipient: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  groupId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Chat_message for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      message: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      sender: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      recipient: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      groupId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
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

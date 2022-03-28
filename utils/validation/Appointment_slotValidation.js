/**
 * Appointment_slotValidation.js
 * @description :: validate each post and put request as per Appointment_slot model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Appointment_slot */
exports.schemaKeys = joi.object({
  startTime: joi.date().options({ convert: true }).required(),
  endTime: joi.date().options({ convert: true }).required(),
  offset: joi.number().integer().allow(0),
  appliedFrom: joi.date().options({ convert: true }).allow(null).allow(''),
  appliedTo: joi.date().options({ convert: true }).allow(null).allow(''),
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Appointment_slot for updation */
exports.updateSchemaKeys = joi.object({
  startTime: joi.date().options({ convert: true }).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  endTime: joi.date().options({ convert: true }).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  offset: joi.number().integer().allow(0),
  appliedFrom: joi.date().options({ convert: true }).allow(null).allow(''),
  appliedTo: joi.date().options({ convert: true }).allow(null).allow(''),
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Appointment_slot for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      startTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      endTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      offset: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      appliedFrom: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      appliedTo: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      userId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
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

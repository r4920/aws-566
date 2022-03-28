/**
 * Appointment_scheduleValidation.js
 * @description :: validate each post and put request as per Appointment_schedule model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Appointment_schedule */
exports.schemaKeys = joi.object({
  slot: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  startTime: joi.date().options({ convert: true }).required(),
  endTime: joi.date().options({ convert: true }).required(),
  date: joi.date().options({ convert: true }).required(),
  offset: joi.number().integer().allow(0),
  participant: joi.array().items(),
  host: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isCancelled: joi.boolean(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Appointment_schedule for updation */
exports.updateSchemaKeys = joi.object({
  slot: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
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
  date: joi.date().options({ convert: true }).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  offset: joi.number().integer().allow(0),
  participant: joi.array().items(),
  host: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isCancelled: joi.boolean(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Appointment_schedule for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      slot: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      startTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      endTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      date: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      offset: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      participant: joi.alternatives().try(joi.array().items(),joi.array().items(),joi.object()),
      host: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isCancelled: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
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

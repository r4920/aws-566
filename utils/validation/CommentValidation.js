/**
 * CommentValidation.js
 * @description :: validate each post and put request as per Comment model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Comment */
exports.schemaKeys = joi.object({
  comment: joi.string().allow(null).allow(''),
  upvoteCount: joi.number().integer().allow(0),
  downVoteCount: joi.number().integer().allow(0),
  commentTime: joi.date().options({ convert: true }).allow(null).allow(''),
  parentItem: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Comment for updation */
exports.updateSchemaKeys = joi.object({
  comment: joi.string().allow(null).allow(''),
  upvoteCount: joi.number().integer().allow(0),
  downVoteCount: joi.number().integer().allow(0),
  commentTime: joi.date().options({ convert: true }).allow(null).allow(''),
  parentItem: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Comment for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      comment: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      upvoteCount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      downVoteCount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      commentTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      parentItem: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
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

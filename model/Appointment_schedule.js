/**
 * Appointment_schedule.js
 * @description :: model of a database collection Appointment_schedule
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    slot:{
      type:Schema.Types.ObjectId,
      ref:'Appointment_slot'
    },

    startTime:{
      type:Date,
      required:true
    },

    endTime:{
      type:Date,
      required:true
    },

    date:{
      type:Date,
      required:true
    },

    offset:{ type:Number },

    participant:{ type:Array },

    host:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    isCancelled:{ type:Boolean },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    isDeleted:{ type:Boolean }
  }
  ,{ 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const Appointment_schedule = mongoose.model('Appointment_schedule',schema);
module.exports = Appointment_schedule;
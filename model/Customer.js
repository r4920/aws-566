/**
 * Customer.js
 * @description :: model of a database collection Customer
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

    firstName:{ type:String },

    lastName:{ type:String },

    name:{ type:String },

    profile:{ type:String },

    contactNumber:{ type:String },

    email:{ type:String },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    updatedBy:{
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
schema.index({ 'firstName':1 },{ 'name':'index_firstName' });
schema.index({ 'lastName':1 },{ 'name':'index_lastName' });
schema.pre('save',async function (next){
  // 'this' refers to the current document about to be saved
  const user = this;

  user.name = `${user.firstName}, ${user.lastName}`;
  
  next();
});
    
schema.post('save',async function (docs,next){
  // 'this' refers to the current document about to be saved
  const user = this;

  user.name = `${user.firstName}, ${user.lastName}`;
  
  next();
});
    
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
const Customer = mongoose.model('Customer',schema);
module.exports = Customer;
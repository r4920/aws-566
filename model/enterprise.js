/**
 * enterprise.js
 * @description :: model of a database collection enterprise
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');
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

    name:{
      type:String,
      required:true,
      unique:true,
      uniqueCaseInsensitive:true
    },

    email:{
      type:String,
      unique:true,
      required:true,
      uniqueCaseInsensitive:true
    },

    phone:{ type:String },

    code:{
      type:String,
      minLength:3,
      lowercase:false,
      trim:false,
      required:true,
      unique:true,
      uniqueCaseInsensitive:true
    },

    address:{ type:String },

    description:{ type:String },

    website:{ type:String },

    isActive:{
      type:Boolean,
      default:true
    },

    isDelete:{
      type:Boolean,
      default:false
    },

    createdAt:{
      type:Date,
      default:'on create currentTime'
    },

    updatedAt:{
      type:Date,
      default:'on update currentTime'
    },

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
schema.plugin(uniqueValidator,{ message: 'Error, expected {VALUE} to be unique.' });
const enterprise = mongoose.model('enterprise',schema);
module.exports = enterprise;
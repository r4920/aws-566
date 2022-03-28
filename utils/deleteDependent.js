/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let OrderItem = require('../model/orderItem');
let Patient = require('../model/patient');
let Order = require('../model/order');
let Medication = require('../model/medication');
let Note = require('../model/note');
let Encounter = require('../model/encounter');
let Enterprise = require('../model/enterprise');
let Departments = require('../model/departments');
let Customer = require('../model/Customer');
let Task = require('../model/Task');
let Comment = require('../model/Comment');
let Plan = require('../model/Plan');
let Chat_group = require('../model/Chat_group');
let Chat_message = require('../model/Chat_message');
let Appointment_schedule = require('../model/Appointment_schedule');
let ToDo = require('../model/ToDo');
let Appointment_slot = require('../model/Appointment_slot');
let Master = require('../model/Master');
let Event = require('../model/Event');
let Blog = require('../model/Blog');
let User = require('../model/user');
let UserTokens = require('../model/userTokens');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');

const deleteOrderItem = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(OrderItem,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePatient = async (filter) =>{
  try {
    let patient = await Patient.find(filter, { _id:1 });
    if (patient.length){
      patient = patient.map((obj) => obj._id);

      const orderFilter = { '$or': [{ patientId : { '$in' : patient } }] };
      await dbService.deleteMany(Order,orderFilter);
      let response  = await dbService.deleteMany(Patient,filter);
      return response;
    } else {
      return 'No patient found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteOrder = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Order,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteMedication = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Medication,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteNote = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Note,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEncounter = async (filter) =>{
  try {
    let encounter = await Encounter.find(filter, { _id:1 });
    if (encounter.length){
      encounter = encounter.map((obj) => obj._id);

      const noteFilter = { '$or': [{ encounterId : { '$in' : encounter } }] };
      await dbService.deleteMany(Note,noteFilter);
      let response  = await dbService.deleteMany(Encounter,filter);
      return response;
    } else {
      return 'No encounter found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEnterprise = async (filter) =>{
  try {
    let enterprise = await Enterprise.find(filter, { _id:1 });
    if (enterprise.length){
      enterprise = enterprise.map((obj) => obj._id);

      const departmentsFilter = { '$or': [{ enterprises : { '$in' : enterprise } }] };
      await dbService.deleteMany(Departments,departmentsFilter);
      let response  = await dbService.deleteMany(Enterprise,filter);
      return response;
    } else {
      return 'No enterprise found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteDepartments = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Departments,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCustomer = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Customer,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTask = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Task,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteComment = async (filter) =>{
  try {
    let comment = await Comment.find(filter, { _id:1 });
    if (comment.length){
      comment = comment.map((obj) => obj._id);

      const CommentFilter = { '$or': [{ parentItem : { '$in' : comment } }] };
      await dbService.deleteMany(Comment,CommentFilter);
      let response  = await dbService.deleteMany(Comment,filter);
      return response;
    } else {
      return 'No Comment found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePlan = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Plan,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteChat_group = async (filter) =>{
  try {
    let chat_group = await Chat_group.find(filter, { _id:1 });
    if (chat_group.length){
      chat_group = chat_group.map((obj) => obj._id);

      const Chat_messageFilter = { '$or': [{ groupId : { '$in' : chat_group } }] };
      await dbService.deleteMany(Chat_message,Chat_messageFilter);
      let response  = await dbService.deleteMany(Chat_group,filter);
      return response;
    } else {
      return 'No Chat_group found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteChat_message = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Chat_message,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_schedule = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Appointment_schedule,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteToDo = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(ToDo,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_slot = async (filter) =>{
  try {
    let appointment_slot = await Appointment_slot.find(filter, { _id:1 });
    if (appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj._id);

      const Appointment_scheduleFilter = { '$or': [{ slot : { '$in' : appointment_slot } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);
      let response  = await dbService.deleteMany(Appointment_slot,filter);
      return response;
    } else {
      return 'No Appointment_slot found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteMaster = async (filter) =>{
  try {
    let master = await Master.find(filter, { _id:1 });
    if (master.length){
      master = master.map((obj) => obj._id);

      const MasterFilter = { '$or': [{ parentId : { '$in' : master } }] };
      await dbService.deleteMany(Master,MasterFilter);
      let response  = await dbService.deleteMany(Master,filter);
      return response;
    } else {
      return 'No Master found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEvent = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Event,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteBlog = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Blog,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);

      const orderItemFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(OrderItem,orderItemFilter);

      const patientFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Patient,patientFilter);

      const orderFilter = { '$or': [{ orderBy : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Order,orderFilter);

      const medicationFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Medication,medicationFilter);

      const noteFilter = { '$or': [{ provider : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Note,noteFilter);

      const encounterFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Encounter,encounterFilter);

      const enterpriseFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Enterprise,enterpriseFilter);

      const departmentsFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Departments,departmentsFilter);

      const CustomerFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Customer,CustomerFilter);

      const TaskFilter = { '$or': [{ completedBy : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Task,TaskFilter);

      const CommentFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Comment,CommentFilter);

      const PlanFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Plan,PlanFilter);

      const Chat_groupFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Chat_group,Chat_groupFilter);

      const Chat_messageFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Chat_message,Chat_messageFilter);

      const Appointment_scheduleFilter = { '$or': [{ host : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);

      const ToDoFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(ToDo,ToDoFilter);

      const Appointment_slotFilter = { '$or': [{ userId : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Appointment_slot,Appointment_slotFilter);

      const MasterFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Master,MasterFilter);

      const EventFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Event,EventFilter);

      const BlogFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      await dbService.deleteMany(Blog,BlogFilter);

      const userFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(User,userFilter);

      const userTokensFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(UserTokens,userTokensFilter);

      const roleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(Role,roleFilter);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);
      let response  = await dbService.deleteMany(User,filter);
      return response;
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserTokens,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);
      let response  = await dbService.deleteMany(Role,filter);
      return response;
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);
      let response  = await dbService.deleteMany(ProjectRoute,filter);
      return response;
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrderItem = async (filter) =>{
  try {
        
    const orderItemCnt =  await OrderItem.countDocuments(filter);
    return { orderItem : orderItemCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countPatient = async (filter) =>{
  try {
        
    let patient = await Patient.find(filter, { _id:1 });
    if (patient.length){
      patient = patient.map((obj) => obj._id);

      const orderFilter = { '$or': [{ patientId : { '$in' : patient } }] };
      const orderCnt =  await dbService.countDocument(Order,orderFilter);

      let response = { order : orderCnt, };
      return response;
    } else {
      return {  patient : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrder = async (filter) =>{
  try {
        
    const orderCnt =  await Order.countDocuments(filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countMedication = async (filter) =>{
  try {
        
    const medicationCnt =  await Medication.countDocuments(filter);
    return { medication : medicationCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countNote = async (filter) =>{
  try {
        
    const noteCnt =  await Note.countDocuments(filter);
    return { note : noteCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countEncounter = async (filter) =>{
  try {
        
    let encounter = await Encounter.find(filter, { _id:1 });
    if (encounter.length){
      encounter = encounter.map((obj) => obj._id);

      const noteFilter = { '$or': [{ encounterId : { '$in' : encounter } }] };
      const noteCnt =  await dbService.countDocument(Note,noteFilter);

      let response = { note : noteCnt, };
      return response;
    } else {
      return {  encounter : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countEnterprise = async (filter) =>{
  try {
        
    let enterprise = await Enterprise.find(filter, { _id:1 });
    if (enterprise.length){
      enterprise = enterprise.map((obj) => obj._id);

      const departmentsFilter = { '$or': [{ enterprises : { '$in' : enterprise } }] };
      const departmentsCnt =  await dbService.countDocument(Departments,departmentsFilter);

      let response = { departments : departmentsCnt, };
      return response;
    } else {
      return {  enterprise : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countDepartments = async (filter) =>{
  try {
        
    const departmentsCnt =  await Departments.countDocuments(filter);
    return { departments : departmentsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countCustomer = async (filter) =>{
  try {
        
    const CustomerCnt =  await Customer.countDocuments(filter);
    return { Customer : CustomerCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countTask = async (filter) =>{
  try {
        
    const TaskCnt =  await Task.countDocuments(filter);
    return { Task : TaskCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countComment = async (filter) =>{
  try {
        
    let comment = await Comment.find(filter, { _id:1 });
    if (comment.length){
      comment = comment.map((obj) => obj._id);

      const CommentFilter = { '$or': [{ parentItem : { '$in' : comment } }] };
      const CommentCnt =  await dbService.countDocument(Comment,CommentFilter);

      let response = { Comment : CommentCnt, };
      return response;
    } else {
      return {  comment : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countPlan = async (filter) =>{
  try {
        
    const PlanCnt =  await Plan.countDocuments(filter);
    return { Plan : PlanCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countChat_group = async (filter) =>{
  try {
        
    let chat_group = await Chat_group.find(filter, { _id:1 });
    if (chat_group.length){
      chat_group = chat_group.map((obj) => obj._id);

      const Chat_messageFilter = { '$or': [{ groupId : { '$in' : chat_group } }] };
      const Chat_messageCnt =  await dbService.countDocument(Chat_message,Chat_messageFilter);

      let response = { Chat_message : Chat_messageCnt, };
      return response;
    } else {
      return {  chat_group : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countChat_message = async (filter) =>{
  try {
        
    const Chat_messageCnt =  await Chat_message.countDocuments(filter);
    return { Chat_message : Chat_messageCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_schedule = async (filter) =>{
  try {
        
    const Appointment_scheduleCnt =  await Appointment_schedule.countDocuments(filter);
    return { Appointment_schedule : Appointment_scheduleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countToDo = async (filter) =>{
  try {
        
    const ToDoCnt =  await ToDo.countDocuments(filter);
    return { ToDo : ToDoCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_slot = async (filter) =>{
  try {
        
    let appointment_slot = await Appointment_slot.find(filter, { _id:1 });
    if (appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj._id);

      const Appointment_scheduleFilter = { '$or': [{ slot : { '$in' : appointment_slot } }] };
      const Appointment_scheduleCnt =  await dbService.countDocument(Appointment_schedule,Appointment_scheduleFilter);

      let response = { Appointment_schedule : Appointment_scheduleCnt, };
      return response;
    } else {
      return {  appointment_slot : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countMaster = async (filter) =>{
  try {
        
    let master = await Master.find(filter, { _id:1 });
    if (master.length){
      master = master.map((obj) => obj._id);

      const MasterFilter = { '$or': [{ parentId : { '$in' : master } }] };
      const MasterCnt =  await dbService.countDocument(Master,MasterFilter);

      let response = { Master : MasterCnt, };
      return response;
    } else {
      return {  master : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countEvent = async (filter) =>{
  try {
        
    const EventCnt =  await Event.countDocuments(filter);
    return { Event : EventCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countBlog = async (filter) =>{
  try {
        
    const BlogCnt =  await Blog.countDocuments(filter);
    return { Blog : BlogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
        
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);

      const orderItemFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const orderItemCnt =  await dbService.countDocument(OrderItem,orderItemFilter);

      const patientFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const patientCnt =  await dbService.countDocument(Patient,patientFilter);

      const orderFilter = { '$or': [{ orderBy : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const orderCnt =  await dbService.countDocument(Order,orderFilter);

      const medicationFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const medicationCnt =  await dbService.countDocument(Medication,medicationFilter);

      const noteFilter = { '$or': [{ provider : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const noteCnt =  await dbService.countDocument(Note,noteFilter);

      const encounterFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const encounterCnt =  await dbService.countDocument(Encounter,encounterFilter);

      const enterpriseFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const enterpriseCnt =  await dbService.countDocument(Enterprise,enterpriseFilter);

      const departmentsFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const departmentsCnt =  await dbService.countDocument(Departments,departmentsFilter);

      const CustomerFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const CustomerCnt =  await dbService.countDocument(Customer,CustomerFilter);

      const TaskFilter = { '$or': [{ completedBy : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const TaskCnt =  await dbService.countDocument(Task,TaskFilter);

      const CommentFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const CommentCnt =  await dbService.countDocument(Comment,CommentFilter);

      const PlanFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const PlanCnt =  await dbService.countDocument(Plan,PlanFilter);

      const Chat_groupFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const Chat_groupCnt =  await dbService.countDocument(Chat_group,Chat_groupFilter);

      const Chat_messageFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const Chat_messageCnt =  await dbService.countDocument(Chat_message,Chat_messageFilter);

      const Appointment_scheduleFilter = { '$or': [{ host : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const Appointment_scheduleCnt =  await dbService.countDocument(Appointment_schedule,Appointment_scheduleFilter);

      const ToDoFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const ToDoCnt =  await dbService.countDocument(ToDo,ToDoFilter);

      const Appointment_slotFilter = { '$or': [{ userId : { '$in' : user } },{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const Appointment_slotCnt =  await dbService.countDocument(Appointment_slot,Appointment_slotFilter);

      const MasterFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const MasterCnt =  await dbService.countDocument(Master,MasterFilter);

      const EventFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const EventCnt =  await dbService.countDocument(Event,EventFilter);

      const BlogFilter = { '$or': [{ updatedBy : { '$in' : user } },{ addedBy : { '$in' : user } }] };
      const BlogCnt =  await dbService.countDocument(Blog,BlogFilter);

      const userFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userCnt =  await dbService.countDocument(User,userFilter);

      const userTokensFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userTokensCnt =  await dbService.countDocument(UserTokens,userTokensFilter);

      const roleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const roleCnt =  await dbService.countDocument(Role,roleFilter);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const projectRouteCnt =  await dbService.countDocument(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const routeRoleCnt =  await dbService.countDocument(RouteRole,routeRoleFilter);

      const userRoleFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userRoleCnt =  await dbService.countDocument(UserRole,userRoleFilter);

      let response = {
        orderItem : orderItemCnt,
        patient : patientCnt,
        order : orderCnt,
        medication : medicationCnt,
        note : noteCnt,
        encounter : encounterCnt,
        enterprise : enterpriseCnt,
        departments : departmentsCnt,
        Customer : CustomerCnt,
        Task : TaskCnt,
        Comment : CommentCnt,
        Plan : PlanCnt,
        Chat_group : Chat_groupCnt,
        Chat_message : Chat_messageCnt,
        Appointment_schedule : Appointment_scheduleCnt,
        ToDo : ToDoCnt,
        Appointment_slot : Appointment_slotCnt,
        Master : MasterCnt,
        Event : EventCnt,
        Blog : BlogCnt,
        user : userCnt,
        userTokens : userTokensCnt,
        role : roleCnt,
        projectRoute : projectRouteCnt,
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response;
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
        
    const userTokensCnt =  await UserTokens.countDocuments(filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
        
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const routeRoleCnt =  await dbService.countDocument(RouteRole,routeRoleFilter);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const userRoleCnt =  await dbService.countDocument(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response;
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
        
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      const routeRoleCnt =  await dbService.countDocument(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response;
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
        
    const routeRoleCnt =  await RouteRole.countDocuments(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
        
    const userRoleCnt =  await UserRole.countDocuments(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrderItem = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await OrderItem.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePatient = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let patient = await Patient.find(filter, { _id:1 });
    if (patient.length){
      patient = patient.map((obj) => obj._id);
      const orderFilter4641 = { 'patientId': { '$in': patient } };
      const order4180 = await softDeleteOrder(orderFilter4641, updateBody);
      return await Patient.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No patient found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrder = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Order.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteMedication = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Medication.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteNote = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Note.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEncounter = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let encounter = await Encounter.find(filter, { _id:1 });
    if (encounter.length){
      encounter = encounter.map((obj) => obj._id);
      const noteFilter2445 = { 'encounterId': { '$in': encounter } };
      const note0146 = await softDeleteNote(noteFilter2445, updateBody);
      return await Encounter.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No encounter found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEnterprise = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let enterprise = await Enterprise.find(filter, { _id:1 });
    if (enterprise.length){
      enterprise = enterprise.map((obj) => obj._id);
      const departmentsFilter9847 = { 'enterprises': { '$in': enterprise } };
      const departments8448 = await softDeleteDepartments(departmentsFilter9847, updateBody);
      return await Enterprise.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No enterprise found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteDepartments = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Departments.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCustomer = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Customer.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTask = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Task.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteComment = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let comment = await Comment.find(filter, { _id:1 });
    if (comment.length){
      comment = comment.map((obj) => obj._id);
      const CommentFilter3775 = { 'parentItem': { '$in': comment } };
      const Comment6526 = await softDeleteComment(CommentFilter3775, updateBody);
      return await Comment.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No Comment found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePlan = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Plan.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteChat_group = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let chat_group = await Chat_group.find(filter, { _id:1 });
    if (chat_group.length){
      chat_group = chat_group.map((obj) => obj._id);
      const Chat_messageFilter6563 = { 'groupId': { '$in': chat_group } };
      const Chat_message2771 = await softDeleteChat_message(Chat_messageFilter6563, updateBody);
      return await Chat_group.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No Chat_group found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteChat_message = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Chat_message.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_schedule = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Appointment_schedule.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteToDo = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await ToDo.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_slot = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let appointment_slot = await Appointment_slot.find(filter, { _id:1 });
    if (appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj._id);
      const Appointment_scheduleFilter6207 = { 'slot': { '$in': appointment_slot } };
      const Appointment_schedule4354 = await softDeleteAppointment_schedule(Appointment_scheduleFilter6207, updateBody);
      return await Appointment_slot.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No Appointment_slot found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteMaster = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let master = await Master.find(filter, { _id:1 });
    if (master.length){
      master = master.map((obj) => obj._id);
      const MasterFilter5327 = { 'parentId': { '$in': master } };
      const Master2223 = await softDeleteMaster(MasterFilter5327, updateBody);
      return await Master.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No Master found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEvent = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Event.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteBlog = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Blog.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const orderItemFilter2802 = { 'addedBy': { '$in': user } };
      const orderItem2089 = await softDeleteOrderItem(orderItemFilter2802, updateBody);
      const orderItemFilter7769 = { 'updatedBy': { '$in': user } };
      const orderItem2260 = await softDeleteOrderItem(orderItemFilter7769, updateBody);
      const patientFilter9997 = { 'addedBy': { '$in': user } };
      const patient8797 = await softDeletePatient(patientFilter9997, updateBody);
      const patientFilter2784 = { 'updatedBy': { '$in': user } };
      const patient2477 = await softDeletePatient(patientFilter2784, updateBody);
      const orderFilter2565 = { 'orderBy': { '$in': user } };
      const order2856 = await softDeleteOrder(orderFilter2565, updateBody);
      const orderFilter8507 = { 'addedBy': { '$in': user } };
      const order0903 = await softDeleteOrder(orderFilter8507, updateBody);
      const orderFilter0967 = { 'updatedBy': { '$in': user } };
      const order5275 = await softDeleteOrder(orderFilter0967, updateBody);
      const medicationFilter3344 = { 'addedBy': { '$in': user } };
      const medication0830 = await softDeleteMedication(medicationFilter3344, updateBody);
      const medicationFilter2323 = { 'updatedBy': { '$in': user } };
      const medication8536 = await softDeleteMedication(medicationFilter2323, updateBody);
      const noteFilter2616 = { 'provider': { '$in': user } };
      const note9525 = await softDeleteNote(noteFilter2616, updateBody);
      const noteFilter2722 = { 'addedBy': { '$in': user } };
      const note2721 = await softDeleteNote(noteFilter2722, updateBody);
      const noteFilter8689 = { 'updatedBy': { '$in': user } };
      const note9284 = await softDeleteNote(noteFilter8689, updateBody);
      const encounterFilter3444 = { 'addedBy': { '$in': user } };
      const encounter1225 = await softDeleteEncounter(encounterFilter3444, updateBody);
      const encounterFilter0296 = { 'updatedBy': { '$in': user } };
      const encounter8600 = await softDeleteEncounter(encounterFilter0296, updateBody);
      const enterpriseFilter6673 = { 'addedBy': { '$in': user } };
      const enterprise2761 = await softDeleteEnterprise(enterpriseFilter6673, updateBody);
      const enterpriseFilter1563 = { 'updatedBy': { '$in': user } };
      const enterprise2273 = await softDeleteEnterprise(enterpriseFilter1563, updateBody);
      const departmentsFilter4470 = { 'addedBy': { '$in': user } };
      const departments3265 = await softDeleteDepartments(departmentsFilter4470, updateBody);
      const departmentsFilter5275 = { 'updatedBy': { '$in': user } };
      const departments5136 = await softDeleteDepartments(departmentsFilter5275, updateBody);
      const CustomerFilter2287 = { 'addedBy': { '$in': user } };
      const Customer8306 = await softDeleteCustomer(CustomerFilter2287, updateBody);
      const CustomerFilter9715 = { 'updatedBy': { '$in': user } };
      const Customer0329 = await softDeleteCustomer(CustomerFilter9715, updateBody);
      const TaskFilter9483 = { 'completedBy': { '$in': user } };
      const Task4245 = await softDeleteTask(TaskFilter9483, updateBody);
      const TaskFilter1873 = { 'updatedBy': { '$in': user } };
      const Task7403 = await softDeleteTask(TaskFilter1873, updateBody);
      const TaskFilter8248 = { 'addedBy': { '$in': user } };
      const Task4352 = await softDeleteTask(TaskFilter8248, updateBody);
      const CommentFilter3545 = { 'updatedBy': { '$in': user } };
      const Comment7753 = await softDeleteComment(CommentFilter3545, updateBody);
      const CommentFilter1516 = { 'addedBy': { '$in': user } };
      const Comment1423 = await softDeleteComment(CommentFilter1516, updateBody);
      const PlanFilter8816 = { 'updatedBy': { '$in': user } };
      const Plan9294 = await softDeletePlan(PlanFilter8816, updateBody);
      const PlanFilter2909 = { 'addedBy': { '$in': user } };
      const Plan2198 = await softDeletePlan(PlanFilter2909, updateBody);
      const Chat_groupFilter5721 = { 'updatedBy': { '$in': user } };
      const Chat_group9434 = await softDeleteChat_group(Chat_groupFilter5721, updateBody);
      const Chat_groupFilter9898 = { 'addedBy': { '$in': user } };
      const Chat_group9463 = await softDeleteChat_group(Chat_groupFilter9898, updateBody);
      const Chat_messageFilter2288 = { 'updatedBy': { '$in': user } };
      const Chat_message2892 = await softDeleteChat_message(Chat_messageFilter2288, updateBody);
      const Chat_messageFilter9739 = { 'addedBy': { '$in': user } };
      const Chat_message9238 = await softDeleteChat_message(Chat_messageFilter9739, updateBody);
      const Appointment_scheduleFilter7735 = { 'host': { '$in': user } };
      const Appointment_schedule6971 = await softDeleteAppointment_schedule(Appointment_scheduleFilter7735, updateBody);
      const Appointment_scheduleFilter7156 = { 'updatedBy': { '$in': user } };
      const Appointment_schedule7741 = await softDeleteAppointment_schedule(Appointment_scheduleFilter7156, updateBody);
      const Appointment_scheduleFilter1507 = { 'addedBy': { '$in': user } };
      const Appointment_schedule3631 = await softDeleteAppointment_schedule(Appointment_scheduleFilter1507, updateBody);
      const ToDoFilter0408 = { 'addedBy': { '$in': user } };
      const ToDo0766 = await softDeleteToDo(ToDoFilter0408, updateBody);
      const ToDoFilter4292 = { 'updatedBy': { '$in': user } };
      const ToDo8451 = await softDeleteToDo(ToDoFilter4292, updateBody);
      const Appointment_slotFilter6072 = { 'userId': { '$in': user } };
      const Appointment_slot7229 = await softDeleteAppointment_slot(Appointment_slotFilter6072, updateBody);
      const Appointment_slotFilter4889 = { 'updatedBy': { '$in': user } };
      const Appointment_slot3804 = await softDeleteAppointment_slot(Appointment_slotFilter4889, updateBody);
      const Appointment_slotFilter6778 = { 'addedBy': { '$in': user } };
      const Appointment_slot2967 = await softDeleteAppointment_slot(Appointment_slotFilter6778, updateBody);
      const MasterFilter3882 = { 'updatedBy': { '$in': user } };
      const Master7950 = await softDeleteMaster(MasterFilter3882, updateBody);
      const MasterFilter6286 = { 'addedBy': { '$in': user } };
      const Master4060 = await softDeleteMaster(MasterFilter6286, updateBody);
      const EventFilter6513 = { 'updatedBy': { '$in': user } };
      const Event4253 = await softDeleteEvent(EventFilter6513, updateBody);
      const EventFilter3786 = { 'addedBy': { '$in': user } };
      const Event4528 = await softDeleteEvent(EventFilter3786, updateBody);
      const BlogFilter0224 = { 'updatedBy': { '$in': user } };
      const Blog7024 = await softDeleteBlog(BlogFilter0224, updateBody);
      const BlogFilter8548 = { 'addedBy': { '$in': user } };
      const Blog2641 = await softDeleteBlog(BlogFilter8548, updateBody);
      const userFilter2363 = { 'addedBy': { '$in': user } };
      const user5998 = await softDeleteUser(userFilter2363, updateBody);
      const userFilter4731 = { 'updatedBy': { '$in': user } };
      const user5442 = await softDeleteUser(userFilter4731, updateBody);
      const userTokensFilter2194 = { 'userId': { '$in': user } };
      const userTokens9928 = await softDeleteUserTokens(userTokensFilter2194, updateBody);
      const userTokensFilter7015 = { 'addedBy': { '$in': user } };
      const userTokens2995 = await softDeleteUserTokens(userTokensFilter7015, updateBody);
      const userTokensFilter8613 = { 'updatedBy': { '$in': user } };
      const userTokens9791 = await softDeleteUserTokens(userTokensFilter8613, updateBody);
      const roleFilter5897 = { 'addedBy': { '$in': user } };
      const role8772 = await softDeleteRole(roleFilter5897, updateBody);
      const roleFilter9646 = { 'updatedBy': { '$in': user } };
      const role8698 = await softDeleteRole(roleFilter9646, updateBody);
      const projectRouteFilter9223 = { 'addedBy': { '$in': user } };
      const projectRoute2463 = await softDeleteProjectRoute(projectRouteFilter9223, updateBody);
      const projectRouteFilter8744 = { 'updatedBy': { '$in': user } };
      const projectRoute9524 = await softDeleteProjectRoute(projectRouteFilter8744, updateBody);
      const routeRoleFilter2532 = { 'addedBy': { '$in': user } };
      const routeRole4296 = await softDeleteRouteRole(routeRoleFilter2532, updateBody);
      const routeRoleFilter1143 = { 'updatedBy': { '$in': user } };
      const routeRole8802 = await softDeleteRouteRole(routeRoleFilter1143, updateBody);
      const userRoleFilter1269 = { 'userId': { '$in': user } };
      const userRole0065 = await softDeleteUserRole(userRoleFilter1269, updateBody);
      const userRoleFilter0939 = { 'addedBy': { '$in': user } };
      const userRole8236 = await softDeleteUserRole(userRoleFilter0939, updateBody);
      const userRoleFilter3326 = { 'updatedBy': { '$in': user } };
      const userRole6584 = await softDeleteUserRole(userRoleFilter3326, updateBody);
      return await User.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserTokens.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter5943 = { 'roleId': { '$in': role } };
      const routeRole3343 = await softDeleteRouteRole(routeRoleFilter5943, updateBody);
      const userRoleFilter9274 = { 'roleId': { '$in': role } };
      const userRole9341 = await softDeleteUserRole(userRoleFilter9274, updateBody);
      return await Role.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter5056 = { 'routeId': { '$in': projectroute } };
      const routeRole7533 = await softDeleteRouteRole(routeRoleFilter5056, updateBody);
      return await ProjectRoute.updateMany(filter, {
        ...defaultValues,
        ...updateBody
      });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.updateMany(filter, {
      ...defaultValues,
      ...updateBody
    });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteOrderItem,
  deletePatient,
  deleteOrder,
  deleteMedication,
  deleteNote,
  deleteEncounter,
  deleteEnterprise,
  deleteDepartments,
  deleteCustomer,
  deleteTask,
  deleteComment,
  deletePlan,
  deleteChat_group,
  deleteChat_message,
  deleteAppointment_schedule,
  deleteToDo,
  deleteAppointment_slot,
  deleteMaster,
  deleteEvent,
  deleteBlog,
  deleteUser,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countOrderItem,
  countPatient,
  countOrder,
  countMedication,
  countNote,
  countEncounter,
  countEnterprise,
  countDepartments,
  countCustomer,
  countTask,
  countComment,
  countPlan,
  countChat_group,
  countChat_message,
  countAppointment_schedule,
  countToDo,
  countAppointment_slot,
  countMaster,
  countEvent,
  countBlog,
  countUser,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteOrderItem,
  softDeletePatient,
  softDeleteOrder,
  softDeleteMedication,
  softDeleteNote,
  softDeleteEncounter,
  softDeleteEnterprise,
  softDeleteDepartments,
  softDeleteCustomer,
  softDeleteTask,
  softDeleteComment,
  softDeletePlan,
  softDeleteChat_group,
  softDeleteChat_message,
  softDeleteAppointment_schedule,
  softDeleteToDo,
  softDeleteAppointment_slot,
  softDeleteMaster,
  softDeleteEvent,
  softDeleteBlog,
  softDeleteUser,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};

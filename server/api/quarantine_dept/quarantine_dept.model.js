import mongoose from 'mongoose';
import {registerEvents} from './quarantine_dept.events';

var QuarantineDeptSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
},{
  timestamps: true
});

registerEvents(QuarantineDeptSchema);
export default mongoose.model('QuarantineDept', QuarantineDeptSchema);

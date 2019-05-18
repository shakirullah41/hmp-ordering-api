import mongoose from 'mongoose';
import {registerEvents} from './quarantine_dept.events';

var QuarantineDeptSchema = new mongoose.Schema({
  date_of_quarantine: Date, 
  proof_doc:String, 
  department:String, // Govt./ private
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  status: String
},{
  timestamps: true
});

registerEvents(QuarantineDeptSchema);
export default mongoose.model('QuarantineDept', QuarantineDeptSchema);

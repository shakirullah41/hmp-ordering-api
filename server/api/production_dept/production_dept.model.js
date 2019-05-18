import mongoose from 'mongoose';
import {registerEvents} from './production_dept.events';

var ProductionDeptSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
},{
  timestamps: true
});

registerEvents(ProductionDeptSchema);
export default mongoose.model('ProductionDept', ProductionDeptSchema);

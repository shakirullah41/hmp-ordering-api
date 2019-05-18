import mongoose from 'mongoose';
import {registerEvents} from './production_dept.events';

var ProductionDeptSchema = new mongoose.Schema({
  man_power: String,
  chilling_capacity: String,
  Packaging: String,
vehicle_availability: Boolean ,
vehicle_information:String, 
time: Date,
hot_weight: String ,
loading_weight: String ,
documents_weight: String ,
airline_weight : String,
customer_weight: String,
},{
  timestamps: true
});

registerEvents(ProductionDeptSchema);
export default mongoose.model('ProductionDept', ProductionDeptSchema);

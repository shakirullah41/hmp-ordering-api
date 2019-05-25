import mongoose from 'mongoose';
import {registerEvents} from './order.events';
const Schema = mongoose.Schema;

var OrderSchema = new mongoose.Schema({
  date_of_delivery: Date,
  product_type: String,
  mode_of_delivery: String,
  type: String,
  mode: String,
  flight_name: String,
  flight_date: Date,
  carcase_weight: String,
  isApprove: Boolean,
  documentation_team: { type: Schema.Types.ObjectId, ref: 'DocumentationDept' },
  production_team: { type: Schema.Types.ObjectId, ref: 'ProductionDept' },
  quarantine_team: { type: Schema.Types.ObjectId, ref: 'QuarantineDept' },
},{
  timestamps: true
});

registerEvents(OrderSchema);
export default mongoose.model('Order', OrderSchema);

import mongoose from 'mongoose';
import {registerEvents} from './order.events';

var OrderSchema = new mongoose.Schema({
  date_of_delivery: Date,
  product_type: String,
  mode_of_delivery: String,
  type: String,
  mode: String,
  flight_name: String,
  flight_date: String,
  carcase_weight: String,
  isApprove: Boolean,
  documention_team: { type: Schema.Types.ObjectId, ref: 'DocumentationDept' },
  production_team: { type: Schema.Types.ObjectId, ref: 'ProductionDept' },
  documention_team: { type: Schema.Types.ObjectId, ref: 'QuarantineDept' },
},{
  timestamps: true
});

registerEvents(OrderSchema);
export default mongoose.model('Order', OrderSchema);

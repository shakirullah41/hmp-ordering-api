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
});

registerEvents(OrderSchema);
export default mongoose.model('Order', OrderSchema);

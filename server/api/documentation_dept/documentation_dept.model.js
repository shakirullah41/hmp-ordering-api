import mongoose from 'mongoose';
import {registerEvents} from './documentation_dept.events';

var DocumentationDeptSchema = new mongoose.Schema({
  booking_airline: String,
  booking_time: String,
  booking_location: String,
  halal_certificate: String,
  doc_creation_date: Date,
  invoice_generation: String,
  certificate_of_origin:String,
  form_e:String,
  driver_name:String,
  status: String,
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
},{
  timestamps: true
});

registerEvents(DocumentationDeptSchema);
export default mongoose.model('DocumentationDept', DocumentationDeptSchema);

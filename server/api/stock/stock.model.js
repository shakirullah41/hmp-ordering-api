import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {registerEvents} from './stock.events';

var StockSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  gate: String,
  vehicle: String,
  mandi: String,
  procured_by : String,
  grn: String,
  total_animals: Number,
  animals_ref: [{ type: Schema.Types.ObjectId, ref: 'Animals' }]
},{
  timestamps: true
});

registerEvents(StockSchema);
export default mongoose.model('Stock', StockSchema);

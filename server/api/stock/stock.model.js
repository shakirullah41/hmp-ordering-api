import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {registerEvents} from './stock.events';

var StockSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  gate: String,
  vehicle: String,
  Mandi: String,
  Procured_by : String,
  grn: String,
  animals: [{ type: Schema.Types.ObjectId, ref: 'Animals' }]
});

registerEvents(StockSchema);
export default mongoose.model('Stock', StockSchema);

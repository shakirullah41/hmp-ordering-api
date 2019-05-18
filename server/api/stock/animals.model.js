import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {registerEvents} from './stock.events';

var StockSchema = new mongoose.Schema({
  stock_id: { type: Schema.Types.ObjectId, ref: 'Stock' },
  type:String,
  tag:String,
  weight_in_kg:Number,
  weight:Number,
  weight_unit:String
});

registerEvents(StockSchema);
export default mongoose.model('Animals', StockSchema);

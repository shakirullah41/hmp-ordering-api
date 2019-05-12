import mongoose from 'mongoose';
import {registerEvents} from './stock.events';

var StockSchema = new mongoose.Schema({
  name: String,
  quantity: String,
});

registerEvents(StockSchema);
export default mongoose.model('Stock', StockSchema);

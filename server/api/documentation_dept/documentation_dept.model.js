import mongoose from 'mongoose';
import {registerEvents} from './documentation_dept.events';

var DocumentationDeptSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(DocumentationDeptSchema);
export default mongoose.model('DocumentationDept', DocumentationDeptSchema);

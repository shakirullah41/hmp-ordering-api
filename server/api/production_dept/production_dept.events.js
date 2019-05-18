/**
 * ProductionDept model events
 */

import {EventEmitter} from 'events';
var ProductionDeptEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductionDeptEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(ProductionDept) {
  for(var e in events) {
    let event = events[e];
    ProductionDept.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ProductionDeptEvents.emit(event + ':' + doc._id, doc);
    ProductionDeptEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ProductionDeptEvents;

/**
 * DocumentationDept model events
 */

import {EventEmitter} from 'events';
var DocumentationDeptEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DocumentationDeptEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(DocumentationDept) {
  for(var e in events) {
    let event = events[e];
    DocumentationDept.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    DocumentationDeptEvents.emit(event + ':' + doc._id, doc);
    DocumentationDeptEvents.emit(event, doc);
  };
}

export {registerEvents};
export default DocumentationDeptEvents;

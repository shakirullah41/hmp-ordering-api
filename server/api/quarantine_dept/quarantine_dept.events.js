/**
 * QuarantineDept model events
 */

import {EventEmitter} from 'events';
var QuarantineDeptEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
QuarantineDeptEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(QuarantineDept) {
  for(var e in events) {
    let event = events[e];
    QuarantineDept.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    QuarantineDeptEvents.emit(event + ':' + doc._id, doc);
    QuarantineDeptEvents.emit(event, doc);
  };
}

export {registerEvents};
export default QuarantineDeptEvents;

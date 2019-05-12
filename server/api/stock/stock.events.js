/**
 * Stock model events
 */

import {EventEmitter} from 'events';
var StockEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StockEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Stock) {
  for(var e in events) {
    let event = events[e];
    Stock.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    StockEvents.emit(event + ':' + doc._id, doc);
    StockEvents.emit(event, doc);
  };
}

export {registerEvents};
export default StockEvents;

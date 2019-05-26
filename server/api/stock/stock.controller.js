/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /y              ->  index
 * POST    /y              ->  create
 * GET     /y/:id          ->  show
 * PUT     /y/:id          ->  upsert
 * PATCH   /y/:id          ->  patch
 * DELETE  /y/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Stock from './stock.model';
import Animals from './animals.model';
import mongoose from 'mongoose';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch(err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}
/**
 * @api {get} /api/stock get a list
 * @apiName List 
 * @apiGroup Stock
 *
 * 
 * @apiSuccess {Date} name Name.
 * @apiSuccess {String} quantity Quantity.
 * @apiSuccess {String} gate Gate.
 * @apiSuccess {String} vehicle vehicle.
 * @apiSuccess {String} mandi Mandi.
 * @apiSuccess {String} Procured_by procured by.
 * @apiSuccess {String} grn grn.
 * @apiSuccess {String} total_animals Total number of animals.
 * @apiSuccess {Array} animals_ref List of animals.
 **/
// Gets a list of Stocks
export function index(req, res) {
    return Stock.find().populate('animals_ref').exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {get} /api/stock/:id get a single record
 * @apiName ById 
 * @apiGroup Stock
 *
 * @apiParam {Number} id stock unique ID.
 * 
* @apiSuccess {Date} name name.
 * @apiSuccess {String} quantity quantity.
 * @apiSuccess {String} gate gate.
 * @apiSuccess {String} vehicle vehicle.
 * @apiSuccess {String} mandi mandi.
 * @apiSuccess {String} procured_by procured by.
 * @apiSuccess {String} grn grn.
 * @apiSuccess {String} total_animals Total number of animals.
 * @apiSuccess {Array} animals_ref List of animals.
 **/
// Gets a single Stock from the DB
export function show(req, res) {
    return Stock.findById(req.params.id).populate('animals_ref').exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {post} /api/stock Create
 * @apiName Create 
 * @apiGroup Stock
 *
 * @apiParam (Request body) {Date} name name .
 * @apiParam (Request body) {String} quantity quantity.
 * @apiParam (Request body) {String} gate gate.
 * @apiParam (Request body) {String} vehicle vehicle.
 * @apiParam (Request body) {String} mandi Mandi.
 * @apiParam (Request body) {String} procured_by procured by.
 * @apiParam (Request body) {String} grn grn.
 * @apiParam (Request body) {Number} total_animals Total number of animals.
 * @apiParam (Request body) {Object[]} animals list of animals.
 * @apiParam (Request body) {String} animals.type animal type.
 * @apiParam (Request body) {String} animals.tag animal tag.
 * @apiParam (Request body) {Number} animals.weight_in_kg animal weight in kg.
 * @apiParam (Request body) {Number} animals.weight animal weight.
 * @apiParam (Request body) {String} animals.weight_unit animal weight unit.
 * 
 * @apiSuccess {Date} name name.
 * @apiSuccess {String} quantity quantity.
 * @apiSuccess {String} gate gate.
 * @apiSuccess {String} vehicle vehicle.
 * @apiSuccess {String} mandi mandi.
 * @apiSuccess {String} procured_by procured by.
 * @apiSuccess {String} grn grn.
 * @apiSuccess {String} total_animals Total number of animals.
 * @apiSuccess {String} total_animals Total number of animals.
 **/
// Creates a new Stock in the DB
export function create(req, res) {
  let stockInfo = {}; 
  let stock = req.body;
  stock._id = new mongoose.Types.ObjectId();
  let animalsData = req.body.animals.map((animal)=>{
    animal.stock_id = stock._id;
    animal._id = new mongoose.Types.ObjectId();
    return animal;
  });
  const animalIds = animalsData.map(animal=>animal._id);
  stock.animals_ref = animalIds;
  return Promise.all([Stock.create(stock),Animals.create(animalsData)])
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Stock in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Stock.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {patch} /api/stock/:id Update
 * @apiName Update 
 * @apiGroup Stock
 *
 * @apiParam {Number} id stock unique ID.
 *
 * @apiParam (Request body) {Date} name name .
 * @apiParam (Request body) {String} quantity quantity. 
 * @apiParam (Request body) {String} gate gate.
 * @apiParam (Request body) {String} vehicle vehicle.
 * @apiParam (Request body) {String} mandi mandi.
 * @apiParam (Request body) {String} procured_by procured by.
 * @apiParam (Request body) {String} grn grm.
 * @apiParam (Request body) {Number} total_animals Total number of animals.
 * 
* @apiSuccess {Date} name name.
 * @apiSuccess {String} quantity quantity.
 * @apiSuccess {String} gate gate.
 * @apiSuccess {String} vehicle vehicle.
 * @apiSuccess {String} mandi mandi.
 * @apiSuccess {String} procured_by procured by.
 * @apiSuccess {String} grn grn.
 * @apiSuccess {String} total_animals Total number of animals.
 **/
// Updates an existing Stock in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Stock.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {delete} /api/stock/:id Delete
 * @apiName Delete 
 * @apiGroup Stock
 *
 * @apiParam {Number} id stock unique ID.
 *
 **/
// Deletes a Stock from the DB
export function destroy(req, res) {
    return Stock.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

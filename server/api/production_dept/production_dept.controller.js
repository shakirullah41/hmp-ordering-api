/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/production_dept              ->  index
 * POST    /api/production_dept              ->  create
 * GET     /api/production_dept/:id          ->  show
 * PUT     /api/production_dept/:id          ->  upsert
 * PATCH   /api/production_dept/:id          ->  patch
 * DELETE  /api/production_dept/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import ProductionDept from './production_dept.model';

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

// Gets a list of ProductionDepts
export function index(req, res) {
    return ProductionDept.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single ProductionDept from the DB
export function show(req, res) {
    return ProductionDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new ProductionDept in the DB
export function create(req, res) {
    return ProductionDept.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given ProductionDept in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return ProductionDept.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {patch} /api/production_dept Updates an existing Production Department
 * @apiName update
 * @apiGroup Production Department
 *
 *
 * @apiParam (Request body) {String} man_power Man Power.
 * @apiParam (Request body) {String} chilling_capacity  Chilling Capacity.
 * @apiParam (Request body) {String} packaging  Packaging.
 * @apiParam (Request body) {Boolean} vehicle_availability  Vehicle Availability.
 * @apiParam (Request body) {String} vehicle_information  Vehicle Information.
 * @apiParam (Request body) {Date} time  Time.
 * @apiParam (Request body) {String} hot_weight  Hot Weight.
 * @apiParam (Request body) {String} loading_weight  Loading Weight.
 * @apiParam (Request body) {String} documents_weight  Documents Weight
 * @apiParam (Request body) {String} airline_weight  Airline Weight.
 * @apiParam (Request body) {String} customer_weight  Customer Weight.
 * @apiParam (Request body) {String} status  status of production department.
 * 
 * @apiSuccess {String} man_power Man Power.
 * @apiSuccess chilling_capacity  Chilling Capacity..
 * @apiSuccess {String} packaging  Packaging.
 * @apiSuccess {Boolean} vehicle_availability  Vehicle Availability.
 * @apiSuccess {String} vehicle_information  Vehicle Information.
 * @apiSuccess {Date} time  Time.
 * @apiSuccess {String} hot_weight  Hot Weight.
 * @apiSuccess {String} loading_weight  Loading Weight.
 * @apiSuccess {String} documents_weight  Documents Weight
 * @apiSuccess {String} airline_weight  Airline Weight.
 * @apiSuccess {String} customer_weight  Customer Weight.
 * @apiSuccess {String} status  status of production department.
 **/
// Updates an existing ProductionDept in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return ProductionDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a ProductionDept from the DB
export function destroy(req, res) {
    return ProductionDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

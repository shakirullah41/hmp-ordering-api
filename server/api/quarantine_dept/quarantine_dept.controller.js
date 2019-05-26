/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/quarantine_dept              ->  index
 * POST    /api/quarantine_dept              ->  create
 * GET     /api/quarantine_dept/:id          ->  show
 * PUT     /api/quarantine_dept/:id          ->  upsert
 * PATCH   /api/quarantine_dept/:id          ->  patch
 * DELETE  /api/quarantine_dept/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import QuarantineDept from './quarantine_dept.model';

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
 * @api {get} /api/quarantine_dept Gets a list
 * @apiName GetAList 
 * @apiGroup Quarantine Department
 *
 *
 * @apiSuccess {Date} date_of_quarantine Date Of Quarantine.
 * @apiSuccess {String} proof_doc  Proof Doc.
 * @apiSuccess {String} department  Department.
 * @apiSuccess {String} status  status Of Quarantine Department.
 **/
// Gets a list of QuarantineDepts
export function index(req, res) {
    const {status='pending'}=req.query;
    return QuarantineDept.find({status}).populate('order').exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {get} /api/quarantine_dept/:id Gets a single record
 * @apiName ById
 * @apiGroup Quarantine Department
 *
 * @apiParam {Number} id Quarantine Dept unique ID.
 *
 * @apiSuccess {Date} date_of_quarantine Date Of Quarantine.
 * @apiSuccess {String} proof_doc  Proof Doc.
 * @apiSuccess {String} department  Department.
 * @apiSuccess {String} status  status Of Quarantine Department.
 **/
// Gets a single QuarantineDept from the DB
export function show(req, res) {
    return QuarantineDept.findById(req.params.id).populate('order').exec()
    .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new QuarantineDept in the DB
export function create(req, res) {
    return QuarantineDept.create(req.body)
    .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given QuarantineDept in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return QuarantineDept.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {patch} /api/quarantine_dept/:id Update
 * @apiName Update 
 * @apiGroup Quarantine Department
 *
 * @apiParam {Number} id Quarantine Dept unique ID.
 *
 * @apiParam (Request body) {Date} date_of_quarantine Date Of Quarantine.
 * @apiParam (Request body) {String} proof_doc  Proof Doc.
 * @apiParam (Request body) {String} department  Department.
 * @apiParam (Request body) {String} status  status Of Quarantine Department.
 * 
 * @apiSuccess {Date} date_of_quarantine Date Of Quarantine.
 * @apiSuccess {String} proof_doc  Proof Doc.
 * @apiSuccess {String} department  Department.
 * @apiSuccess {String} status  status Of Quarantine Department.
 **/
// Updates an existing QuarantineDept in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return QuarantineDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
// Deletes a QuarantineDept from the DB
export function destroy(req, res) {
    return QuarantineDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

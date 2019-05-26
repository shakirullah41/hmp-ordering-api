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
import DocumentationDept from './documentation_dept.model';

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
 * @api {get} /api/doc_team Gets a list of DocumentationDepts
 * @apiName GetOrderDocumentations
 * @apiGroup Documentation Department
 *
 * @apiParam (Query Params) {String} status Status.
 *
 * @apiSuccess {String} booking_airline Booking Airline.
 * @apiSuccess {Date} booking_time  Booking Time.
 * @apiSuccess {String} booking_location  Booking Location.
 * @apiSuccess {String} halal_certificate  Halal Certificate.
 * @apiSuccess {Date} doc_creation_date  Doc Creation Date.
 * @apiSuccess {String} invoice_generation  invoice generation.
 * @apiSuccess {String} certificate_of_origin  Certificate of origin.
 * @apiSuccess {String} form_e  Form e.
 * @apiSuccess {String} driver_name  Driver Name.
 * @apiSuccess {String} status  status of Documentation department.
 **/
// Gets a list of DocumentationDepts
export function index(req, res) {
    const {status='pending'}=req.query;
    return DocumentationDept.find({status}).populate('order').exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {get} /api/doc_team/:id Gets a single DocumentationDepts
 * @apiName GetOrderDocumentations
 * @apiGroup Documentation Department
 *
 * @apiParam {Number} id Documentation unique ID.
 *
 * @apiSuccess {String} booking_airline Booking Airline.
 * @apiSuccess {Date} booking_time  Booking Time.
 * @apiSuccess {String} booking_location  Booking Location.
 * @apiSuccess {String} halal_certificate  Halal Certificate.
 * @apiSuccess {Date} doc_creation_date  Doc Creation Date.
 * @apiSuccess {String} invoice_generation  invoice generation.
 * @apiSuccess {String} certificate_of_origin  Certificate of origin.
 * @apiSuccess {String} form_e  Form e.
 * @apiSuccess {String} driver_name  Driver Name.
 * @apiSuccess {String} status  status of Documentation department.
 **/
// Gets a single DocumentationDept from the DB
export function show(req, res) {
    return DocumentationDept.findById(req.params.id).populate('order').exec()
    .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
// Creates a new DocumentationDept in the DB
export function create(req, res) {
    return DocumentationDept.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given DocumentationDept in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return DocumentationDept.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {patch} /api/doc_team/:id update Documentation for Order
 * @apiName CreateDocumentation
 * @apiGroup Documentation Department
 *
 * @apiParam {Number} id Documentation unique ID.
 *
 * @apiParam (Request body) {String} booking_airline Booking Airline.
 * @apiParam (Request body) {Date} booking_time  Booking Time.
 * @apiParam (Request body) {String} booking_location  Booking Location.
 * @apiParam (Request body) {String} halal_certificate  Halal Certificate.
 * @apiParam (Request body) {Date} doc_creation_date  Doc Creation Date.
 * @apiParam (Request body) {String} invoice_generation  invoice generation.
 * @apiParam (Request body) {String} certificate_of_origin  Certificate of origin.
 * @apiParam (Request body) {String} form_e  Form e.
 * @apiParam (Request body) {String} driver_name  Driver Name.
 * @apiParam (Request body) {String} status  status of Documentation department.
 * 
 * @apiSuccess {String} booking_airline Booking Airline.
 * @apiSuccess {Date} booking_time  Booking Time.
 * @apiSuccess {String} booking_location  Booking Location.
 * @apiSuccess {String} halal_certificate  Halal Certificate.
 * @apiSuccess {Date} doc_creation_date  Doc Creation Date.
 * @apiSuccess {String} invoice_generation  invoice generation.
 * @apiSuccess {String} certificate_of_origin  Certificate of origin.
 * @apiSuccess {String} form_e  Form e.
 * @apiSuccess {String} driver_name  Driver Name.
 * @apiSuccess {String} status  status of Documentation department.
 **/
// Updates an existing DocumentationDept in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return DocumentationDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
// Deletes a DocumentationDept from the DB
export function destroy(req, res) {
    return DocumentationDept.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

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
import Order from './order.model';
import DocumentationDept from '../documentation_dept/documentation_dept.model';
import ProductionDept from '../production_dept/production_dept.model';
import QuarantineDept from '../quarantine_dept/quarantine_dept.model';
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
 * @api {get} /api/order Get list of Orders
 * @apiName GetOrders
 * @apiGroup Order
 *
 * @apiParam (Query Params) {Boolean} isApprove To get approved Orders.
 *
 * @apiSuccess {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiSuccess {String} product_type  Product Type of the Order.
 * @apiSuccess {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiSuccess {String} type  type of the Order.
 * @apiSuccess {String} mode  mode of the Order.
 * @apiSuccess {String} flight_name  Flight Name of the Order.
 * @apiSuccess {String} flight_date  Flight Date of the Order.
 * @apiSuccess {String} carcase_weight  Carcase Weight of the Order.
 * @apiSuccess {String} documentation_team  production_team.
 * @apiSuccess {String} quarantine_team  quarantine_team.
 * @apiSuccess {String} production_team  production_team.
 **/
// Gets a list of Orders
export function index(req, res) {
    const {isApprove=false} = req.query;

    return Order.find({isApprove})
    .populate('documentation_team')
    .populate('quarantine_team')
    .populate('production_team')
    .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {get} /api/order/:id Gets a single Order
 * @apiName GetOrder
 * @apiGroup Order
 *
 * @apiParam {Number} id Order unique ID.
 *
 * @apiSuccess {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiSuccess {String} product_type  Product Type of the Order.
 * @apiSuccess {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiSuccess {String} type  type of the Order.
 * @apiSuccess {String} mode  mode of the Order.
 * @apiSuccess {String} flight_name  Flight Name of the Order.
 * @apiSuccess {String} flight_date  Flight Date of the Order.
 * @apiSuccess {String} carcase_weight  Carcase Weight of the Order.
 */
// Gets a single Order from the DB
export function show(req, res) {
    return Order.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {post} /api/order Creates a new Order
 * @apiName CreateOrder
 * @apiGroup Order
 *
 * @apiParam (Request body) {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiParam (Request body) {String} product_type  Product Type of the Order.
 * @apiParam (Request body) {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiParam (Request body) {String} type  type of the Order.
 * @apiParam (Request body) {String} mode  mode of the Order.
 * @apiParam (Request body) {String} flight_name  Flight Name of the Order.
 * @apiParam (Request body) {String} flight_date  Flight Date of the Order.
 * @apiParam (Request body) {String} carcase_weight  Carcase Weight of the Order.
 * 
 * @apiSuccess {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiSuccess {String} product_type  Product Type of the Order.
 * @apiSuccess {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiSuccess {String} type  type of the Order.
 * @apiSuccess {String} mode  mode of the Order.
 * @apiSuccess {String} flight_name  Flight Name of the Order.
 * @apiSuccess {String} flight_date  Flight Date of the Order.
 * @apiSuccess {String} carcase_weight  Carcase Weight of the Order.
 */
// Creates a new Order in the DB
export function create(req, res) {
    req.body.isApprove = false;
    return Order.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}
// Upserts the given Order in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
        Reflect.deleteProperty(req.body, 'isApprove');
    }
    return Order.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {put} /api/order/:id Approve Order
 * @apiName ApproveOrders
 * @apiGroup Order
 *
 * @apiParam {Number} id Order unique ID.
 *
 * @apiSuccess {String} check Order is already approved.
 * @apiSuccess {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiSuccess {String} product_type  Product Type of the Order.
 * @apiSuccess {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiSuccess {String} type  type of the Order.
 * @apiSuccess {String} mode  mode of the Order.
 * @apiSuccess {String} flight_name  Flight Name of the Order.
 * @apiSuccess {String} flight_date  Flight Date of the Order.
 * @apiSuccess {String} carcase_weight  Carcase Weight of the Order.
 * 
 */
export async function approve(req, res) {
    const orderdata = await Order.findById(req.params.id);
    if(orderdata.isApprove){
        return req.send('order is already approved');
    }
    let toCreate = {order:req.params.id,status:'pending',_id:new mongoose.Types.ObjectId()};
    await Promise.all([
        DocumentationDept.create(toCreate),
        ProductionDept.create(toCreate),
        QuarantineDept.create(toCreate)
    ]);
    return Order.update({_id: req.params.id}, {
        isApprove:true,
        documentation_team: toCreate._id,
        production_team:toCreate._id,
        quarantine_team: toCreate._id,
    }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {patch} /api/order/:id Update Order
 * @apiName UpdateOrder
 * @apiGroup Order
 *
 * @apiParam {Number} id Order unique ID.
 *
 * @apiParam (Request body) {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiParam (Request body) {String} product_type  Product Type of the Order.
 * @apiParam (Request body) {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiParam (Request body) {String} type  type of the Order.
 * @apiParam (Request body) {String} mode  mode of the Order.
 * @apiParam (Request body) {String} flight_name  Flight Name of the Order.
 * @apiParam (Request body) {String} flight_date  Flight Date of the Order.
 * @apiParam (Request body) {String} carcase_weight  Carcase Weight of the Order.
 * 
 * @apiSuccess {Date} date_of_delivery Date Of Delivery of the Order.
 * @apiSuccess {String} product_type  Product Type of the Order.
 * @apiSuccess {String} mode_of_delivery  Mode Of Delivery of the Order.
 * @apiSuccess {String} type  type of the Order.
 * @apiSuccess {String} mode  mode of the Order.
 * @apiSuccess {String} flight_name  Flight Name of the Order.
 * @apiSuccess {String} flight_date  Flight Date of the Order.
 * @apiSuccess {String} carcase_weight  Carcase Weight of the Order.
 */
// Updates an existing Order in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
        Reflect.deleteProperty(req.body, 'isApprove');
    }
    return Order.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
/**
 * @api {delete} /api/order/:id Delete Order
 * @apiName DeleteOrder
 * @apiGroup Order
 *
 * @apiParam {Number} id Order unique ID.
 *
 */
// Deletes a Order from the DB
export function destroy(req, res) {
    return Order.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

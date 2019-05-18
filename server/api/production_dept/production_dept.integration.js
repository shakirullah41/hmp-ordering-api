/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProductionDept;

describe('ProductionDept API:', function() {
  describe('GET /api/production_dept', function() {
    var productionDepts;

    beforeEach(function(done) {
      request(app)
        .get('/api/production_dept')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          productionDepts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(productionDepts).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/production_dept', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/production_dept')
        .send({
          name: 'New ProductionDept',
          info: 'This is the brand new productionDept!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProductionDept = res.body;
          done();
        });
    });

    it('should respond with the newly created productionDept', function() {
      expect(newProductionDept.name).to.equal('New ProductionDept');
      expect(newProductionDept.info).to.equal('This is the brand new productionDept!!!');
    });
  });

  describe('GET /api/production_dept/:id', function() {
    var productionDept;

    beforeEach(function(done) {
      request(app)
        .get(`/api/production_dept/${newProductionDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          productionDept = res.body;
          done();
        });
    });

    afterEach(function() {
      productionDept = {};
    });

    it('should respond with the requested productionDept', function() {
      expect(productionDept.name).to.equal('New ProductionDept');
      expect(productionDept.info).to.equal('This is the brand new productionDept!!!');
    });
  });

  describe('PUT /api/production_dept/:id', function() {
    var updatedProductionDept;

    beforeEach(function(done) {
      request(app)
        .put(`/api/production_dept/${newProductionDept._id}`)
        .send({
          name: 'Updated ProductionDept',
          info: 'This is the updated productionDept!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProductionDept = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductionDept = {};
    });

    it('should respond with the updated productionDept', function() {
      expect(updatedProductionDept.name).to.equal('Updated ProductionDept');
      expect(updatedProductionDept.info).to.equal('This is the updated productionDept!!!');
    });

    it('should respond with the updated productionDept on a subsequent GET', function(done) {
      request(app)
        .get(`/api/production_dept/${newProductionDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let productionDept = res.body;

          expect(productionDept.name).to.equal('Updated ProductionDept');
          expect(productionDept.info).to.equal('This is the updated productionDept!!!');

          done();
        });
    });
  });

  describe('PATCH /api/production_dept/:id', function() {
    var patchedProductionDept;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/production_dept/${newProductionDept._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ProductionDept' },
          { op: 'replace', path: '/info', value: 'This is the patched productionDept!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProductionDept = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProductionDept = {};
    });

    it('should respond with the patched productionDept', function() {
      expect(patchedProductionDept.name).to.equal('Patched ProductionDept');
      expect(patchedProductionDept.info).to.equal('This is the patched productionDept!!!');
    });
  });

  describe('DELETE /api/production_dept/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/production_dept/${newProductionDept._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productionDept does not exist', function(done) {
      request(app)
        .delete(`/api/production_dept/${newProductionDept._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});

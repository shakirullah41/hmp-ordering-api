/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newQuarantineDept;

describe('QuarantineDept API:', function() {
  describe('GET /api/quarantine_dept', function() {
    var quarantineDepts;

    beforeEach(function(done) {
      request(app)
        .get('/api/quarantine_dept')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          quarantineDepts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(quarantineDepts).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/quarantine_dept', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/quarantine_dept')
        .send({
          name: 'New QuarantineDept',
          info: 'This is the brand new quarantineDept!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newQuarantineDept = res.body;
          done();
        });
    });

    it('should respond with the newly created quarantineDept', function() {
      expect(newQuarantineDept.name).to.equal('New QuarantineDept');
      expect(newQuarantineDept.info).to.equal('This is the brand new quarantineDept!!!');
    });
  });

  describe('GET /api/quarantine_dept/:id', function() {
    var quarantineDept;

    beforeEach(function(done) {
      request(app)
        .get(`/api/quarantine_dept/${newQuarantineDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          quarantineDept = res.body;
          done();
        });
    });

    afterEach(function() {
      quarantineDept = {};
    });

    it('should respond with the requested quarantineDept', function() {
      expect(quarantineDept.name).to.equal('New QuarantineDept');
      expect(quarantineDept.info).to.equal('This is the brand new quarantineDept!!!');
    });
  });

  describe('PUT /api/quarantine_dept/:id', function() {
    var updatedQuarantineDept;

    beforeEach(function(done) {
      request(app)
        .put(`/api/quarantine_dept/${newQuarantineDept._id}`)
        .send({
          name: 'Updated QuarantineDept',
          info: 'This is the updated quarantineDept!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedQuarantineDept = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedQuarantineDept = {};
    });

    it('should respond with the updated quarantineDept', function() {
      expect(updatedQuarantineDept.name).to.equal('Updated QuarantineDept');
      expect(updatedQuarantineDept.info).to.equal('This is the updated quarantineDept!!!');
    });

    it('should respond with the updated quarantineDept on a subsequent GET', function(done) {
      request(app)
        .get(`/api/quarantine_dept/${newQuarantineDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let quarantineDept = res.body;

          expect(quarantineDept.name).to.equal('Updated QuarantineDept');
          expect(quarantineDept.info).to.equal('This is the updated quarantineDept!!!');

          done();
        });
    });
  });

  describe('PATCH /api/quarantine_dept/:id', function() {
    var patchedQuarantineDept;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/quarantine_dept/${newQuarantineDept._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched QuarantineDept' },
          { op: 'replace', path: '/info', value: 'This is the patched quarantineDept!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedQuarantineDept = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedQuarantineDept = {};
    });

    it('should respond with the patched quarantineDept', function() {
      expect(patchedQuarantineDept.name).to.equal('Patched QuarantineDept');
      expect(patchedQuarantineDept.info).to.equal('This is the patched quarantineDept!!!');
    });
  });

  describe('DELETE /api/quarantine_dept/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/quarantine_dept/${newQuarantineDept._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when quarantineDept does not exist', function(done) {
      request(app)
        .delete(`/api/quarantine_dept/${newQuarantineDept._id}`)
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

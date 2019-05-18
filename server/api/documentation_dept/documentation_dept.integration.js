/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDocumentationDept;

describe('DocumentationDept API:', function() {
  describe('GET /y', function() {
    var documentationDepts;

    beforeEach(function(done) {
      request(app)
        .get('/y')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          documentationDepts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(documentationDepts).to.be.instanceOf(Array);
    });
  });

  describe('POST /y', function() {
    beforeEach(function(done) {
      request(app)
        .post('/y')
        .send({
          name: 'New DocumentationDept',
          info: 'This is the brand new documentationDept!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDocumentationDept = res.body;
          done();
        });
    });

    it('should respond with the newly created documentationDept', function() {
      expect(newDocumentationDept.name).to.equal('New DocumentationDept');
      expect(newDocumentationDept.info).to.equal('This is the brand new documentationDept!!!');
    });
  });

  describe('GET /y/:id', function() {
    var documentationDept;

    beforeEach(function(done) {
      request(app)
        .get(`/y/${newDocumentationDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          documentationDept = res.body;
          done();
        });
    });

    afterEach(function() {
      documentationDept = {};
    });

    it('should respond with the requested documentationDept', function() {
      expect(documentationDept.name).to.equal('New DocumentationDept');
      expect(documentationDept.info).to.equal('This is the brand new documentationDept!!!');
    });
  });

  describe('PUT /y/:id', function() {
    var updatedDocumentationDept;

    beforeEach(function(done) {
      request(app)
        .put(`/y/${newDocumentationDept._id}`)
        .send({
          name: 'Updated DocumentationDept',
          info: 'This is the updated documentationDept!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDocumentationDept = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDocumentationDept = {};
    });

    it('should respond with the updated documentationDept', function() {
      expect(updatedDocumentationDept.name).to.equal('Updated DocumentationDept');
      expect(updatedDocumentationDept.info).to.equal('This is the updated documentationDept!!!');
    });

    it('should respond with the updated documentationDept on a subsequent GET', function(done) {
      request(app)
        .get(`/y/${newDocumentationDept._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let documentationDept = res.body;

          expect(documentationDept.name).to.equal('Updated DocumentationDept');
          expect(documentationDept.info).to.equal('This is the updated documentationDept!!!');

          done();
        });
    });
  });

  describe('PATCH /y/:id', function() {
    var patchedDocumentationDept;

    beforeEach(function(done) {
      request(app)
        .patch(`/y/${newDocumentationDept._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched DocumentationDept' },
          { op: 'replace', path: '/info', value: 'This is the patched documentationDept!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDocumentationDept = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDocumentationDept = {};
    });

    it('should respond with the patched documentationDept', function() {
      expect(patchedDocumentationDept.name).to.equal('Patched DocumentationDept');
      expect(patchedDocumentationDept.info).to.equal('This is the patched documentationDept!!!');
    });
  });

  describe('DELETE /y/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/y/${newDocumentationDept._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when documentationDept does not exist', function(done) {
      request(app)
        .delete(`/y/${newDocumentationDept._id}`)
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

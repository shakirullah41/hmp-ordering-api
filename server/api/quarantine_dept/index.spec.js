/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var quarantineDeptCtrlStub = {
  index: 'quarantineDeptCtrl.index',
  show: 'quarantineDeptCtrl.show',
  create: 'quarantineDeptCtrl.create',
  upsert: 'quarantineDeptCtrl.upsert',
  patch: 'quarantineDeptCtrl.patch',
  destroy: 'quarantineDeptCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var quarantineDeptIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './quarantine_dept.controller': quarantineDeptCtrlStub
});

describe('QuarantineDept API Router:', function() {
  it('should return an express router instance', function() {
    expect(quarantineDeptIndex).to.equal(routerStub);
  });

  describe('GET /api/quarantine_dept', function() {
    it('should route to quarantineDept.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'quarantineDeptCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/quarantine_dept/:id', function() {
    it('should route to quarantineDept.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'quarantineDeptCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/quarantine_dept', function() {
    it('should route to quarantineDept.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'quarantineDeptCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/quarantine_dept/:id', function() {
    it('should route to quarantineDept.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'quarantineDeptCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/quarantine_dept/:id', function() {
    it('should route to quarantineDept.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'quarantineDeptCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/quarantine_dept/:id', function() {
    it('should route to quarantineDept.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'quarantineDeptCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});

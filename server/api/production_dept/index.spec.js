/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var productionDeptCtrlStub = {
  index: 'productionDeptCtrl.index',
  show: 'productionDeptCtrl.show',
  create: 'productionDeptCtrl.create',
  upsert: 'productionDeptCtrl.upsert',
  patch: 'productionDeptCtrl.patch',
  destroy: 'productionDeptCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productionDeptIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './production_dept.controller': productionDeptCtrlStub
});

describe('ProductionDept API Router:', function() {
  it('should return an express router instance', function() {
    expect(productionDeptIndex).to.equal(routerStub);
  });

  describe('GET /api/production_dept', function() {
    it('should route to productionDept.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'productionDeptCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/production_dept/:id', function() {
    it('should route to productionDept.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'productionDeptCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/production_dept', function() {
    it('should route to productionDept.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'productionDeptCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/production_dept/:id', function() {
    it('should route to productionDept.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'productionDeptCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/production_dept/:id', function() {
    it('should route to productionDept.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'productionDeptCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/production_dept/:id', function() {
    it('should route to productionDept.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'productionDeptCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var documentationDeptCtrlStub = {
  index: 'documentationDeptCtrl.index',
  show: 'documentationDeptCtrl.show',
  create: 'documentationDeptCtrl.create',
  upsert: 'documentationDeptCtrl.upsert',
  patch: 'documentationDeptCtrl.patch',
  destroy: 'documentationDeptCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var documentationDeptIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './documentation_dept.controller': documentationDeptCtrlStub
});

describe('DocumentationDept API Router:', function() {
  it('should return an express router instance', function() {
    expect(documentationDeptIndex).to.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to documentationDept.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'documentationDeptCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to documentationDept.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'documentationDeptCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to documentationDept.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'documentationDeptCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to documentationDept.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'documentationDeptCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to documentationDept.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'documentationDeptCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to documentationDept.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'documentationDeptCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var stockCtrlStub = {
  index: 'stockCtrl.index',
  show: 'stockCtrl.show',
  create: 'stockCtrl.create',
  upsert: 'stockCtrl.upsert',
  patch: 'stockCtrl.patch',
  destroy: 'stockCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var stockIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './stock.controller': stockCtrlStub
});

describe('Stock API Router:', function() {
  it('should return an express router instance', function() {
    expect(stockIndex).to.equal(routerStub);
  });

  describe('GET /y', function() {
    it('should route to stock.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'stockCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/:id', function() {
    it('should route to stock.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'stockCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /y', function() {
    it('should route to stock.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'stockCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /y/:id', function() {
    it('should route to stock.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'stockCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /y/:id', function() {
    it('should route to stock.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'stockCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /y/:id', function() {
    it('should route to stock.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'stockCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});

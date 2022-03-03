const sinon = require('sinon');
const { expect } = require('chai');
const productsService = require('../../../services/products');
const productsController = require('../../../controllers/products');

const fakeProducts = [
  { id: 1, name: 'batata', quantity: 200 },
  { id: 2, name: 'pão', quantity: 20 },
];

const notFoundErrorObj = { error: { name: 'notFound', message: 'Product not found' } };
const conflictErrorObj = { error: { name: 'conflict', message: 'Product already exists' } };

const mockGetAllEmpty = () => {
  sinon.stub(productsService, 'getAll').resolves([]);
};

const mockGetAllFakeProducts = () => {
  sinon.stub(productsService, 'getAll').resolves(fakeProducts);
};

const mockRestoreGetAll = () => {
  productsService.getAll.restore();
};

const mockGetByIdError = () => {
  sinon.stub(productsService, 'getById').resolves(notFoundErrorObj);
};

const mockGetByIdFakeProduct = () => {
  sinon.stub(productsService, 'getById').resolves(fakeProducts[0]);
};

const mockRestoreGetById = () => {
  productsService.getById.restore();
};


describe('Products Controller', () => {
  describe('Pega todos os produtos', () => {
    describe('quando não há produtos no banco de dados', () => {
      const req = {}, res = {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        mockGetAllEmpty();
      });

      after(mockRestoreGetAll);

      it('envia o status 200 OK', async () => {
        await productsController.getAll(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um array vazio como resposta em json', async () => {
        await productsController.getAll(req, res);

        expect(res.json.calledWith([])).to.be.true;
      });
    });

    describe('quando há produtos no banco de dados', () => {
      const req = {}, res = {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        mockGetAllFakeProducts();
      });

      after(mockRestoreGetAll);

      it('envia o status 200 OK', async () => {
        await productsController.getAll(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um array com os produtos como resposta em json', async () => {
        await productsController.getAll(req, res);

        expect(res.json.calledWith(fakeProducts)).to.be.true;
      });
    });
  });

  describe('Pega um produto pelo id', () => {
    describe('quando não há produto com o id passado', () => {
      const req = {}, res = {};
      let next = () => {};

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        next = sinon.stub().returns();

        mockGetByIdError();
      });

      after(mockRestoreGetById);

      it('chama o next e passa o erro como parâmetro', async () => {
        await productsController.getById(req, res, next);

        expect(next.calledWith(notFoundErrorObj.error)).to.be.true;
      });
    });

    describe('quando há um produto com o id passado', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(productsService, 'getById').resolves(fakeProducts[0]);
      });

      after(() => {
        productsService.getById.restore();
      });

      it('envia o status 200 OK', async () => {
        await productsController.getById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um objeto com as informações do produto como resposta em json', async () => {
        await productsController.getById(req, res);

        expect(res.json.calledWith(fakeProducts[0])).to.be.true;
      });
    });
  });

  describe('Adiciona um produto ao banco de dados', () => {
    describe('quando o nome do produto passado já está cadastrado', () => {
      const req = {}, res = {};
      let next;

      before(() => {
        req.body = {
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        };
        next = sinon.stub().returns();

        sinon.stub(productsService, 'create').resolves(conflictErrorObj);
      });

      after(() => {
        productsService.create.restore();
      });

      it('chama o next passando o objeto de erro como parâmetro', async () => {
        await productsController.create(req, res, next);

        expect(next.calledWith(conflictErrorObj.error)).to.be.true;
      });
    });

    describe('quando o nome do produto passado ainda não está cadastrado', () => {
      const req = {}, res = {};

      before(() => {
        req.body = {
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(productsService, 'create').resolves(fakeProducts[0]);
      });

      after(() => {
        productsService.create.restore();
      });

      it('envia o status 201 Created', async () => {
        await productsController.create(req, res);

        expect(res.status.calledWith(201)).to.be.true;
      });

      it('envia um objeto com as informações do produto criado', async () => {
        await productsController.create(req, res);

        expect(res.json.calledWith(fakeProducts[0])).to.be.true;
      });
    });
  });

  describe('Atualiza um produto no banco de dados', () => {
    describe('quando não há produto com o id passado', () => {
      const req = {}, res = {};
      let next;

      before(() => {
        req.params = { id: fakeProducts[0].id };
        req.body = {
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        };
        next = sinon.stub().returns();

        sinon.stub(productsService, 'update').resolves(notFoundErrorObj);
      });

      after(() => {
        productsService.update.restore();
      });

      it('chama o next e passa o erro como parâmetro', async () => {
        await productsController.update(req, res, next);

        expect(next.calledWith(notFoundErrorObj.error)).to.be.true;
      });
    });

    describe('quando há um produto com o id passado', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: fakeProducts[0].id };
        req.body = {
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(productsService, 'update').resolves(fakeProducts[0]);
      });

      after(() => {
        productsService.update.restore();
      });

      it('envia o status 200 OK', async () => {
        await productsController.update(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um objeto com as informações do produto como resposta em json', async () => {
        await productsController.update(req, res);

        expect(res.json.calledWith(fakeProducts[0])).to.be.true;
      });
    });
  });

  describe('Apaga um produto no banco de dados', () => {
    describe('quando não há produto com o id passado', () => {
      const req = {}, res = {};
      let next;

      before(() => {
        req.params = { id: fakeProducts[0].id };
        next = sinon.stub().returns();

        sinon.stub(productsService, 'exclude').resolves(notFoundErrorObj);
      });

      after(() => {
        productsService.exclude.restore();
      });

      it('chama o next e passa o erro como parâmetro', async () => {
        await productsController.exclude(req, res, next);

        expect(next.calledWith(notFoundErrorObj.error)).to.be.true;
      });
    });

    describe('quando há um produto com o id passado', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: fakeProducts[0].id };
        res.status = sinon.stub().returns(res);
        res.end = sinon.stub().returns();

        sinon.stub(productsService, 'exclude').resolves();
      });

      after(() => {
        productsService.exclude.restore();
      });

      it('envia o status 204 No Content', async () => {
        await productsController.exclude(req, res);

        expect(res.status.calledWith(204)).to.be.true;
      });

      it('encerra a conexão, chama o método end() do express', async () => {
        await productsController.exclude(req, res);

        expect(res.end.called).to.be.true;
      });
    });
  });
});

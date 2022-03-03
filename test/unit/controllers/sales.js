const sinon = require('sinon');
const { expect } = require('chai');
const salesService = require('../../../services/sales');
const salesController = require('../../../controllers/sales');

const fakeSales = [
  {
    saleId: 1,
    date: '2021-09-09T04:54:29.000Z',
    productId: 1,
    quantity: 2,
  },
  {
    saleId: 1,
    date: '2021-09-09T04:54:54.000Z',
    productId: 2,
    quantity: 2,
  },
];

const fakeSaleCreateObj = {
  id: 1,
  itemsSold: [
    {
      productId: 1,
      quantity: 2,
    },
    {
      productId: 2,
      quantity: 5,
    },
  ],
};

const fakeSaleUpdateObj = {
  saleId: 1,
  itemUpdated: [
    {
      productId: 1,
      quantity: 2,
    }
  ],
};

const notFoundErrorObj = { error: { name: 'notFound', message: 'Sale not found' } };

describe('Sales Controller', () => {
  describe('Pega todas as vendas', () => {
    describe('quando não há vendas no banco de dados', () => {
      const req = {}, res = {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(salesService, 'getAll').resolves([]);
      });

      after(() => {
        salesService.getAll.restore();
      });

      it('envia o status 200 OK', async () => {
        await salesController.getAll(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um array vazio como resposta em json', async () => {
        await salesController.getAll(req, res);

        expect(res.json.calledWith([])).to.be.true;
      });
    });

    describe('quando há vendas no banco de dados', () => {
      const req = {}, res = {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(salesService, 'getAll').resolves(fakeSales);
      });

      after(() => {
        salesService.getAll.restore();
      });

      it('envia o status 200 OK', async () => {
        await salesController.getAll(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um array com as vendas como resposta em json', async () => {
        await salesController.getAll(req, res);

        expect(res.json.calledWith(fakeSales)).to.be.true;
      });
    });
  });

  describe('Pega uma venda pelo id', () => {
    describe('quando não há uma venda com o id passado', () => {
      const req = {}, res = {};
      let next;

      before(() => {
        req.params = { id: 1 };
        next = sinon.stub().returns();

        sinon.stub(salesService, 'getById').resolves(notFoundErrorObj);
      });

      after(() => {
        salesService.getById.restore();
      });

      it('chama o next e passa o erro como parâmetro', async () => {
        await salesController.getById(req, res, next);

        expect(next.calledWith(notFoundErrorObj.error)).to.be.true;
      });
    });

    describe('quando há uma venda com o id passado', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(salesService, 'getById').resolves([fakeSales[0]]);
      });

      after(() => {
        salesService.getById.restore();
      });

      it('envia o status 200 OK', async () => {
        await salesController.getById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('envia um array com as vendas que tem o id passado como resposta em json', async () => {
        await salesController.getById(req, res);

        expect(res.json.calledWith([fakeSales[0]])).to.be.true;
      });
    });
  });

  describe('Adiciona uma ou mais vendas ao banco de dados', () => {
    describe('quando da tudo certo', () => {
      const req = {}, res = {};

      before(() => {
        req.body = [];
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(salesService, 'create').resolves(fakeSaleCreateObj);
      });

      after(() => {
        salesService.create.restore();
      });

      it('envia o status 201 Created', async () => {
        await salesController.create(req, res);

        expect(res.status.calledWith(201)).to.be.true;
      });

      it('deve retornar um objeto com as informações da(s) venda(s) em json', async () => {
        await salesController.create(req, res);

        expect(res.json.calledWith(fakeSaleCreateObj)).to.be.true;
      });
    });
  });

  describe('Atualiza uma ou mais vendas no banco de dados', () => {
    describe('quando da tudo certo', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: 1 };
        req.body = [];
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();

        sinon.stub(salesService, 'update').resolves(fakeSaleUpdateObj);
      });

      after(() => {
        salesService.update.restore();
      });

      it('envia o status 200 OK', async () => {
        await salesController.update(req, res);

        expect(res.status.calledWith(200)).to.be.true;
      });

      it('deve retornar um objeto com as informações da(s) venda(s) em json', async () => {
        await salesController.update(req, res);

        expect(res.json.calledWith(fakeSaleUpdateObj)).to.be.true;
      });
    });
  });

  describe('Apaga uma venda do banco de dados', () => {
    describe('quando não há uma venda com o id passado', () => {
      const req = {}, res = {};
      let next;

      before(() => {
        req.params = { id: 1 };
        next = sinon.stub().returns();

        sinon.stub(salesService, 'exclude').resolves(notFoundErrorObj);
      });

      after(() => {
        salesService.exclude.restore();
      });

      it('chama o next e passa o erro como parâmetro', async () => {
        await salesController.exclude(req, res, next);

        expect(next.calledWith(notFoundErrorObj.error)).to.be.true;
      });
    });

    describe('quando há uma venda com o id passado', () => {
      const req = {}, res = {};

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.end = sinon.stub().returns();

        sinon.stub(salesService, 'exclude').resolves([fakeSales[0]]);
      });

      after(() => {
        salesService.exclude.restore();
      });

      it('envia o status 204 No Content', async () => {
        await salesController.exclude(req, res);

        expect(res.status.calledWith(204)).to.be.true;
      });

      it('encerra a conexão, cham o end() do express', async () => {
        await salesController.exclude(req, res);

        expect(res.end.called).to.be.true;
      });
    });
  });
});

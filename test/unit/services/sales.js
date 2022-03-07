const sinon = require('sinon');
const { expect } = require('chai');
const salesModel = require('../../../models/sales');
const salesService = require('../../../services/sales');
const productsService = require('../../../services/products');

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

const fakeSaleByIdOutput= [
  {
    date: '2021-09-09T04:54:29.000Z',
    productId: 1,
    quantity: 2,
  },
];

const fakeSaleCreateArr = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 5,
  },
];

describe('Sales Service', () => {
  describe('Pega todas as vendas', () => {
    describe('quando não há vendas no banco de dados', () => {
      before(() => {
        sinon.stub(salesModel, 'getAll').resolves([]);
      });

      after(() => {
        salesModel.getAll.restore();
      });

      it('retorna um array vazio', async () => {
        const vendas = await salesService.getAll();

        expect(vendas).to.be.an('array');
        expect(vendas).to.be.empty;
      });
    });

    describe('quando há vendas no banco de dados', () => {
      before(() => {
        sinon.stub(salesModel, 'getAll').resolves(fakeSales);
      });

      after(() => {
        salesModel.getAll.restore();
      });

      it('retorna um array de vendas', async () => {
        const vendas = await salesService.getAll();

        expect(vendas).to.be.an('array');
        expect(vendas).to.be.deep.equal(fakeSales);
      });
    });
  });

  describe('Pega uma venda pelo id', () => {
    describe('quando não há venda com o id passado', () => {
      before(() => {
        sinon.stub(salesModel, 'getById').resolves(null);
      });

      after(() => {
        salesModel.getById.restore();
      });

      it('retorna um objeto de erro', async () => {
        const errorObj = {
          error: { name: 'notFound', message: 'Sale not found' },
        };
        const venda = await salesService.getById(1);

        expect(venda).to.be.deep.equal(errorObj);
      });
    });

    describe('quando há uma venda com o id passado', () => {
      before(() => {
        sinon.stub(salesModel, 'getById').resolves([fakeSales[0]]);
      });

      after(() => {
        salesModel.getById.restore();
      });

      it('retorna um array com as informações da venda com o id passado', async () => {
        const venda = await salesService.getById(1);

        expect(venda).to.be.an('array');
        expect(venda).to.be.deep.equal(fakeSaleByIdOutput);
      });

      it('os objetos de venda não podem ter a propriedade "saleId"', async () => {
        const venda = await salesService.getById(1);

        venda.forEach((ven) => expect(ven).to.not.have.property('saleId'));
      });
    });
  });
  
  describe('Adiciona uma ou mais vendas ao banco de dados', () => {
    describe('quando da tudo certo', () => {
      before(() => {
        sinon.stub(salesModel, 'create').resolves({ saleId: 1 });
        sinon.stub(productsService, 'decreaseQuantity').resolves();
      });

      after(() => {
        salesModel.create.restore();
        productsService.decreaseQuantity.restore();
      })

      it('deve retornar um objeto com as informações da(s) venda(s)', async () => {
        const result = await salesService.create(fakeSaleCreateArr);
        const expectedResult = { id: 1, itemsSold: fakeSaleCreateArr };

        expect(result).to.be.an('object');
        expect(result).to.be.deep.equal(expectedResult);
      });
    });
  });

  describe('Atualiza uma ou mais vendas no banco de dados', () => {
    describe('quando da tudo certo', () => {
      before(() => {
        sinon.stub(salesModel, 'update').resolves();
      });

      after(() => {
        salesModel.update.restore();
      })

      it('deve retornar um objeto com as informações da(s) venda(s)', async () => {
        const result = await salesService.update(1, fakeSaleCreateArr);
        const expectedResult = { saleId: 1, itemUpdated: fakeSaleCreateArr };

        expect(result).to.be.an('object');
        expect(result).to.be.deep.equal(expectedResult);
      });
    });
  });

  describe('Apaga uma venda pelo id', () => {
    describe('quando não há venda com o id passado', () => {
      before(() => {
        sinon.stub(salesModel, 'getById').resolves(null);
      });

      after(() => {
        salesModel.getById.restore();
      });

      it('retorna um objeto de erro', async () => {
        const errorObj = {
          error: { name: 'notFound', message: 'Sale not found' },
        };
        const venda = await salesService.exclude(1);

        expect(venda).to.be.deep.equal(errorObj);
      });
    });

    describe('quando há uma venda com o id passado', () => {
      before(() => {
        sinon.stub(salesModel, 'getById').resolves([fakeSales[0]]);
        sinon.stub(productsService, 'increaseQuantity').resolves();
        sinon.stub(salesModel, 'exclude').resolves({});
      });

      after(() => {
        salesModel.getById.restore();
        productsService.increaseQuantity.restore();
        salesModel.exclude.restore();
      });

      it('retorna nada', async () => {
        const result = await salesService.exclude(1);

        expect(result).to.be.undefined;
      });
    });
  });
});

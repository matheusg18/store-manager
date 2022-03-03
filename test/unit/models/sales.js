const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../../models/connection');
const sales = require('../../../models/sales');

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

describe('Sales Model', () => {
  describe('Pega todas as vendas', () => {
    describe('quando não há vendas no banco de dados', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna um array vazio', async () => {
        const vendas = await sales.getAll();

        expect(vendas).to.be.an('array');
        expect(vendas).to.be.empty;
      });
    });

    describe('quando há vendas no banco de dados', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([fakeSales]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna um array de vendas', async () => {
        const vendas = await sales.getAll();

        expect(vendas).to.be.an('array');
        expect(vendas).to.be.deep.equal(fakeSales);
      });
    });
  });

  describe('Pega uma venda pelo id', () => {
    describe('quando não há venda com o id passado', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna null', async () => {
        const venda = await sales.getById(1);

        expect(venda).to.be.null;
      });
    });

    describe('quando há uma venda com o id passado', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[fakeSales[0]]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna um array com as informações da venda com o id passado', async () => {
        const venda = await sales.getById(1);

        expect(venda).to.be.an('array');
        expect(venda).to.be.deep.equal([fakeSales[0]]);
      });
    });
  });

  describe('Adiciona uma venda ao banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto com o saleId', async () => {
        const result = await sales.create([
          {
            productId: fakeSales[0].productId,
            quantity: fakeSales[0].quantity,
          },
        ]);

        expect(result).to.be.an('object');
        expect(result).to.have.property('saleId');
      });
    });
  });

  describe('Atualiza uma venda no banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{}]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto', async () => {
        const result = await sales.update({
          productId: fakeSales[0].productId,
          saleId: fakeSales[0].saleId,
          quantity: fakeSales[0].quantity,
        })

        expect(result).to.be.an('object');
      });
    });
  });

  describe('Apaga uma venda do banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{}]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto', async () => {
        const result = await sales.exclude(fakeSales[0].saleId);

        expect(result).to.be.an('object');
      });
    });
  });
});

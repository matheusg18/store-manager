const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const products = require('../../../models/products');

const fakeProduct = { id: 1, name: 'batata', quantity: 200 };

const mockDatabaseEmpty = async () => {
  const emptyExecuteResponse = [[]];
  sinon.stub(connection, 'execute').resolves(emptyExecuteResponse);
};

const mockDatabaseFakeProduct = async () => {
  const mockValue = [[fakeProduct]];
  sinon.stub(connection, 'execute').resolves(mockValue);
};

const mockRestore = async () => {
  connection.execute.restore();
};

describe('Products Model', () => {
  describe('Pega todos os produtos', () => {
    describe('quando não há produtos no banco de dados', () => {
      before(mockDatabaseEmpty);
      after(mockRestore);

      it('retorna um array vazio', async () => {
        const result = await products.getAll();
        expect(result).to.be.an('array');
        expect(result).to.be.empty;
      });
    });

    describe('quando há produtos no banco de dados', () => {
      before(mockDatabaseFakeProduct);
      after(mockRestore);

      it('retorna um array', async () => {
        const result = await products.getAll();
        expect(result).to.be.an('array');
      });

      it('de objetos com as chaves "id", "name", "quantity"', async () => {
        const [result] = await products.getAll();
        expect(result).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('Pega um produto pelo id', () => {
    describe('quando não há produto com o id passado', () => {
      before(mockDatabaseEmpty);
      after(mockRestore);

      it('retorna null', async () => {
        const result = await products.getById(1);
        expect(result).to.be.null;
      });
    });

    describe('quando há um produto com o id passado', () => {
      before(mockDatabaseFakeProduct);
      after(mockRestore);

      it('retorna um objeto com as informaçẽos do produto', async () => {
        const result = await products.getById(1);
        expect(result).to.be.deep.equal(fakeProduct);
      });
    });
  });

  describe('Pega um produto pelo nome', () => {
    describe('quando não existe um produto com o nome passado', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna null', async () => {
        const product = await products.getByName('batata');

        expect(product).to.be.null;
      });
    });

    describe('quando existe um produto com o nome passado', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[fakeProduct]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('retorna um objeto com as informações do produto"', async () => {
        const product = await products.getByName('batata');

        expect(product).to.be.deep.equal(fakeProduct);
      });
    });
  });

  describe('Adiciona um produto ao banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto contendo o insertId do produto criado', async () => {
        const result = await products.create({
          name: fakeProduct.name,
          quantity: fakeProduct.quantity,
        });

        expect(result).to.have.property('insertId');
      });
    });
  });

  describe('Atualiza quantidade de um produto no banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{}]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto com as informações do update', async () => {
        const result = await products.updateQuantity({
          id: fakeProduct.id,
          quantity: fakeProduct.quantity,
        });

        expect(result).to.be.an('object');
      });
    });
  });

  describe('Atualiza um produto no banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{}]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto com as informações do update', async () => {
        const result = await products.update(fakeProduct)

        expect(result).to.be.an('object');
      });
    });
  });

  describe('Apaga um produto do banco de dados', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([{}]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando da tudo certo', () => {
      it('retorna um objeto com as informações do exclude', async () => {
        const result = await products.exclude(fakeProduct.id);

        expect(result).to.be.an('object');
      });
    });
  });
});

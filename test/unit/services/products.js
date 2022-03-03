const sinon = require('sinon');
const { expect } = require('chai');
const productsService = require('../../../services/products');
const productsModel = require('../../../models/products');

const fakeProducts = [
  { id: 1, name: 'batata', quantity: 200 },
  { id: 2, name: 'pão', quantity: 20 },
];

const mockGetAllEmpty = () => {
  sinon.stub(productsModel, 'getAll').resolves([]);
};

const mockGetAllFakeProducts = () => {
  sinon.stub(productsModel, 'getAll').resolves(fakeProducts);
};

const mockRestoreGetAll = () => {
  productsModel.getAll.restore();
};

const mockGetByIdNull = () => {
  sinon.stub(productsModel, 'getById').resolves(null);
};

const mockGetByIdFakeProduct = () => {
  sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
};

const mockRestoreGetById = () => {
  productsModel.getById.restore();
};

describe('Products Services', () => {
  describe('Pega todos os produtos', () => {
    afterEach(mockRestoreGetAll);

    describe('quando não há produtos no banco de dados', () => {
      before(mockGetAllEmpty);

      it('retorna um array vazio', async () => {
        const products = await productsService.getAll();

        expect(products).to.be.an('array');
        expect(products).to.be.empty;
      });
    });

    describe('quando há produtos no banco de dados', () => {
      before(mockGetAllFakeProducts);

      it('retorna um array de produtos', async () => {
        const products = await productsService.getAll();

        expect(products).to.be.an('array');
        expect(products).to.be.deep.equal(fakeProducts);
      });
    });
  });

  describe('Pega um produto pelo id', () => {
    afterEach(mockRestoreGetById);

    describe('quando não há produto com o id passado', () => {
      const errorObj = {
        error: { name: 'notFound', message: 'Product not found' },
      };
      before(mockGetByIdNull);

      it('retorna um objeto de erro', async () => {
        const product = await productsService.getById(1);

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(errorObj);
      });
    });

    describe('quando há um produto com o id passado', () => {
      before(mockGetByIdFakeProduct);

      it('retorna um objeto com as informaçẽos do produto', async () => {
        const product = await productsService.getById(1);

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(fakeProducts[0]);
      });
    });
  });

  describe('Adiciona um produto ao banco de dados', () => {
    describe('quando o nome do produto passado já está cadastrado', () => {
      before(() => {
        sinon.stub(productsModel, 'getByName').resolves(fakeProducts[0]);
      });

      after(() => {
        productsModel.getByName.restore();
      });

      it('retorna um objeto de erro', async () => {
        const errorObj = {
          error: { name: 'conflict', message: 'Product already exists' },
        };
        const product = await productsService.create({
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        });

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(errorObj);
      });
    });

    describe('quando o nome do produto passado ainda não está cadastrado', () => {
      before(() => {
        sinon.stub(productsModel, 'getByName').resolves(null);
        sinon
          .stub(productsModel, 'create')
          .resolves({ insertId: fakeProducts[0].id });
      });

      after(() => {
        productsModel.getByName.restore();
        productsModel.create.restore();
      });

      it('retorna um objeto com as informações do produto cadastrado', async () => {
        const product = await productsService.create({
          name: fakeProducts[0].name,
          quantity: fakeProducts[0].quantity,
        });

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(fakeProducts[0]);
      });
    });
  });

  describe('Atualiza um produto no banco de dados', () => {
    describe('quando não há produto com o id passado', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('retorna um objeto de erro', async () => {
        const errorObj = {
          error: { name: 'notFound', message: 'Product not found' },
        };
        const product = await productsService.update(fakeProducts[0]);

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(errorObj);
      });
    });

    describe('quando há um produto com o id passado', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
        sinon.stub(productsModel, 'update').resolves({});
      });

      after(() => {
        productsModel.getById.restore();
        productsModel.update.restore();
      });

      it('retorna um objeto com as informações do produto', async () => {
        const product = await productsService.update(fakeProducts[0]);

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(fakeProducts[0]);
      });
    });
  });

  describe('Apaga um produto do banco de dados', () => {
    describe('quando não há produto com o id passado', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('retorna um objeto de erro', async () => {
        const errorObj = {
          error: { name: 'notFound', message: 'Product not found' },
        };
        const product = await productsService.exclude(fakeProducts[0].id);

        expect(product).to.be.an('object');
        expect(product).to.be.deep.equal(errorObj);
      });
    });

    describe('quando há um produto com o id passado', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
        sinon.stub(productsModel, 'exclude').resolves({});
      });

      after(() => {
        productsModel.getById.restore();
        productsModel.exclude.restore();
      });

      it('retorna nada', async () => {
        const product = await productsService.exclude(fakeProducts[0].id);

        expect(product).to.be.undefined;
      });
    });
  });

  describe('Diminui a quantidade de um produto no banco de dados', () => {
    describe('quando a quantidade a diminuir é maior do que a quantidade de produtos', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('lança um erro', async () => {
        await productsService.decreaseQuantity(1, 2000).catch((err) => {
          expect(err.name).to.be.equal('unprocessableEntity');
          expect(err.message).to.be.equal('Such amount is not permitted to sell');
        });
      });
    });

    describe('quando a quantidade a diminuir é menor do que a quantidade de produtos', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
        sinon.stub(productsModel, 'updateQuantity').resolves({});
      });

      after(() => {
        productsModel.getById.restore();
        productsModel.updateQuantity.restore();
      });

      it('diminui a quantidade do produto no banco de dados mas não retorna nada', async () => {
        const result = await productsService.decreaseQuantity(1, 1);

        expect(result).to.be.undefined;
      });
    });
  });

  describe('Aumenta a quantidade de um produto no banco de dados', () => {
    describe('quando da tudo certo', () => {
      before(() => {
        sinon.stub(productsModel, 'getById').resolves(fakeProducts[0]);
        sinon.stub(productsModel, 'updateQuantity').resolves({});
      });

      after(() => {
        productsModel.getById.restore();
        productsModel.updateQuantity.restore();
      });

      it('aumenta a quantidade do produto no banco de dados mas não retorna nada', async () => {
        const result = await productsService.increaseQuantity(1, 1);

        expect(result).to.be.undefined;
      });
    });
  });
});


const sinon = require('sinon');
const { expect } = require('chai');
const validateSale = require('../../../middlewares/validateSale');

describe('ValidateSale Middleware', () => {
  describe('quando não é passado um productId', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = [{ quantity: 1 }];
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateSale(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.nested.include({
        'details[0].message': '400|"productId" is required',
      });
    });
  });

  describe('quando não é passado uma quantidade', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = [{ productId: 1 }];
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateSale(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.nested.include({
        'details[0].message': '400|"quantity" is required',
      });
    });
  });

  describe('quando a quantidade passado é menor que 1', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = [{ productId: 1, quantity: 0 }];
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateSale(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.nested.include({
        'details[0].message': '422|"quantity" must be greater than or equal to 1',
      });
    });
  });

  describe('quando o productId e o quantity estão ok', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = [{ productId: 1, quantity: 1 }];
      next = sinon.stub().returns();
    });

    it('chama o next', () => {
      validateSale(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.be.undefined;
    });
  });
});

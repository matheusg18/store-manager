const sinon = require('sinon');
const { expect } = require('chai');
const validateProductMiddleware = require('../../../middlewares/validateProduct');

describe('ValidateProduct Middleware', () => {
  describe('quando não é passado o nome', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = { quantity: 1 };
      // mocko o next
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateProductMiddleware(req, res, next);
      // Aqui eu pego o valor que foi passado como parâmetro para o next
      const nextParam = next.firstCall.firstArg;

      // Aqui eu verifico se dentro do parâmetro do next na chave details, posição 0, chave message tem a mensagem que eu espero
      expect(nextParam).to.nested.include({
        'details[0].message': '400|"name" is required',
      });
    });
  });

  describe('quando o nome passado tem menos de 5 caracteres', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = { name: 'bat', quantity: 1 };
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateProductMiddleware(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.nested.include({
        'details[0].message': '422|"name" length must be at least 5 characters long',
      });
    });
  });

  describe('quando não é passado a quantidade', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = { name: 'batata' };
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateProductMiddleware(req, res, next);
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
      req.body = { name: 'batata', quantity: 0 };
      next = sinon.stub().returns();
    });

    it('chama o next com a mensagem de erro do Joi', () => {
      validateProductMiddleware(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.nested.include({
        'details[0].message': '422|"quantity" must be greater than or equal to 1',
      });
    });
  });

  describe('quando o nome e a quantidade estão ok', () => {
    const req = {}, res = {};
    let next;

    before(() => {
      req.body = { name: 'batata', quantity: 1 };
      next = sinon.stub().returns();
    });

    it('chama o next', () => {
      validateProductMiddleware(req, res, next);
      const nextParam = next.firstCall.firstArg;

      expect(nextParam).to.be.undefined;
    });
  });
});

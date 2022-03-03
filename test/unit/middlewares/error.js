const sinon = require('sinon');
const { expect } = require('chai');
const errorMiddleware = require('../../../middlewares/error');

describe('ErrorMiddleware', () => {
  describe('quando acontecer um erro de Joi', () => {
    const res = {}, req = {}, next = {};
    const err = { isJoi: true, details: [{ message: '400|erro de Joi' }] };

    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
    });

    it('envia o status que vem na mensagem do Joi', () => {
      errorMiddleware(err, req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('envia a mensagem do erro que vem no Joi como json', () => {
      errorMiddleware(err, req, res, next);

      expect(res.json.calledWith({ message: 'erro de Joi' })).to.be.true;
    });
  });

  describe('quando acontecer o erro "notFound"', () => {
    const res = {}, req = {}, next = {};
    const err = { name: 'notFound', message: 'Product not found' };

    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
    });

    it('envia o status 404 Not Found', () => {
      errorMiddleware(err, req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('envia a mensagem do erro como json', () => {
      errorMiddleware(err, req, res, next);

      expect(res.json.calledWith({ message: err.message })).to.be.true;
    });
  });

  describe('quando acontecer o erro "conflict"', () => {
    const res = {}, req = {}, next = {};
    const err = { name: 'conflict', message: 'Product already exists' };

    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
    });

    it('envia o status 409 Conflict', () => {
      errorMiddleware(err, req, res, next);

      expect(res.status.calledWith(409)).to.be.true;
    });

    it('envia a mensagem do erro como json', () => {
      errorMiddleware(err, req, res, next);

      expect(res.json.calledWith({ message: err.message })).to.be.true;
    });
  });

  describe('quando acontecer um erro não esperado', () => {
    const res = {}, req = {}, next = {};
    const err = { name: 'TypeError', message: 'TypeError occurred' };

    before(() => {
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
    });

    it('envia o status 500 Internal Server Error', () => {
      errorMiddleware(err, req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
    });

    it('envia a mensagem do erro como json', () => {
      errorMiddleware(err, req, res, next);

      expect(res.json.calledWith({ message: err.message })).to.be.true;
    });
  });
});

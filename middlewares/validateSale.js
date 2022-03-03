const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    productId: Joi.number().required().messages({
      'any.required': '400|"productId" is required',
    }),
    quantity: Joi.number().required().greater(0).messages({
      'any.required': '400|"quantity" is required',
      'number.greater': '422|"quantity" must be greater than or equal to 1',
    }),
  }),
);

module.exports = (req, _res, next) => {
  const productsInfo = req.body;
  const { error } = schema.validate(productsInfo);

  if (error) return next(error);

  next();
};

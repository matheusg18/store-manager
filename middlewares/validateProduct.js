const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required().min(5).messages({
    'any.required': '400|"name" is required',
    'string.min': '422|"name" length must be at least 5 characters long',
  }),
  quantity: Joi.number().required().greater(0).messages({
    'any.required': '400|"quantity" is required',
    'number.greater': '422|"quantity" must be greater than or equal to 1',
  }),
});

module.exports = (req, _res, next) => {
  const { name, quantity } = req.body;
  const { error } = schema.validate({ name, quantity });

  if (error) return next(error);

  next();
};

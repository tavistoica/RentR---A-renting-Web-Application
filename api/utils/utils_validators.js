const Joi = require("joi");

const validateBody = (schema) => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    if (!req.value) {
      req.value = {};
    }
    req.value["body"] = result.value;
    next();
  };
};

const schemas = {
  authSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  editEmailSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    newEmail: Joi.string().email().required(),
  }),
  editPasswordSchema: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
    newPassword2: Joi.string().required(),
  }),
  editSchema: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
  registerSchema: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatar: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  createPostSchema: Joi.object().keys({
    size: Joi.number().required(),
    rooms: Joi.number().required(),
    photoBase64: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    price: Joi.number().required(),
  }),
  editPostSchema: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    photoBase64: Joi.string().required(),
    location: Joi.string().required(),
  }),
  changeAvatarSchema: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};

module.exports = { validateBody, schemas };

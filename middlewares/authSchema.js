
const Joi = require('joi');
const { joiPassword } = require('joi-password');

const regSchema = Joi.object().keys({
    firstName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    telephone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),

    confPassword: Joi.ref('password')

})

const adminSchema = Joi.object().keys({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    role: Joi.string()
        .required()
        .valid('seniorEngineer', 'labTechnician', 'RTDAManager','labDirector', 'admin'),
    
    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),

    confPassword: Joi.ref('password')
})

const resetPasswordSchema = Joi.object().keys({
    newPassword: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),

    confPassword: Joi.ref('newPassword')
})

module.exports = {
    regSchema,
    adminSchema,
    resetPasswordSchema
}
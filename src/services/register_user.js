const Joi = require('joi');
const bcrypt = require('bcrypt');
const {connectDB, getDB} = require("../config/db");

const register_user = async function (request, response) {
    try {
        let body = request.body
        console.log(body)
        const schema = Joi.object({
            email: Joi.string().email().lowercase().required().messages({
                'any.required': 'email is required',
                'string.email': 'Please provide a valid email address.',
                'string.empty': 'email is not allowed to be empty'
            }),
            fullName: Joi.string().lowercase().required().messages({
                'any.required': 'fullName is required',
                'string.empty': 'fullName is not allowed to be empty'
            }),
            password: Joi.string().required().messages({
                'any.required': 'password is required',
                'string.empty': 'password is not allowed to be empty'
            }),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.required': 'confirmPassword is required',
                'string.empty': 'confirmPassword is not allowed to be empty'
            })
        });

        const {error: err, value: validatedEvent} = schema.validate(body, {abortEarly: false});
        if (err) {
            const errorMessage = err.details.map((d) => d.message);
            return response.status(400).send({status_code: 400, message: errorMessage[0]})
        }
        const {email, fullName, password, confirmPassword} = validatedEvent;

        const db = getDB();
        const existingUser = await db.collection("Users").findOne({email, isActive: true});
        console.log(existingUser)

        if (existingUser) {
            return response.status(400).send({status_code: 400, message: "email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection("Users").insertOne({
            email: email,
            fullName: fullName,
            createdAt: new Date().getTime(),
            isActive: true,
            password: hashedPassword
        });

        return response.send({status_code: 200, message: "user created successfully", data: result})
    } catch (e) {
        console.log(e.message)
        return response.status(500).send({status_code: 500, message: e.message})
    }
}

module.exports = register_user

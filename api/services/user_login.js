const Joi = require('joi');
const {connectDB, getDB} = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const user_login = async function (request, response) {
    try {
        let body = request.body
        console.log(body)
        const schema = Joi.object({
            email: Joi.string().required().messages({
                'any.required': 'email is required',
                'string.empty': 'email is not allowed to be empty'
            }),
            password: Joi.string().required().messages({
                'any.required': 'password is required',
                'string.empty': 'password is not allowed to be empty'
            })
        });

        const {error: err, value: validatedEvent} = schema.validate(body, {abortEarly: false});

        if (err) {
            const errorMessage = err.details.map((d) => d.message);
            return response.status(400).send({status_code: 400, message: errorMessage[0]})
        }
        const {email, password} = validatedEvent;
        const db = getDB();
        const existingUser = await db.collection("Users").findOne({email, isActive: true});

        if (!existingUser) {
            return response.status(401).send({status_code: 401, message: "Email not exists"})
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return response.status(401).send({status_code: 401, message: "Invalid credentials"})
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
        }, process.env.JWT_SECRET, {expiresIn: '10h'});

        return response.send({status_code: 200, message: "logged in successfully", data: token})
    } catch (e) {
        console.log(e.message)
        return response.status(500).send({status_code: 500, message: e.message})
    }
}
module.exports = user_login
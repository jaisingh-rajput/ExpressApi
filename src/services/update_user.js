const Joi = require('joi');
const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");
const {connectDB, getDB} = require("../config/db");

const update_user = async function (request, response) {
    try {
        let body = request.body
        let authorization = request.header('authorization')
        const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        console.log(body, decoded)
        const schema = Joi.object({
            fullName: Joi.string().lowercase().optional().messages({
                'any.required': 'fullName is required',
                'string.empty': 'fullName is not allowed to be empty'
            }),
            email: Joi.string().optional().messages({
                'any.required': 'email is required',
                'string.empty': 'email is not allowed to be empty'
            })
        });

        const {error: err, value: validatedEvent} = schema.validate(body, {abortEarly: false});
        if (err) {
            const errorMessage = err.details.map((d) => d.message);
            return response.status(400).send({status_code: 400, message: errorMessage[0]})
        }
        const {fullName, email} = validatedEvent;

        let updateKey = {}
        if (fullName) {
            updateKey['fullName'] = fullName
        }

        if (email) {
            updateKey['email'] = email
        }
        const db = getDB();
        console.log(decoded.userId)
        const existingUser = await db.collection("Users").findOne({_id: new ObjectId(decoded.userId), isActive: true});
        console.log(existingUser)
        if (!existingUser) {
            return response.status(404).send({status_code: 404, message: "user not found"})
        }
        console.log(updateKey)
        await db.collection("Users").updateOne(
            {_id: new ObjectId(decoded.userId)},
            {$set: updateKey}
        );
        return response.send({status_code: 200, message: "updated successfully"})
    } catch (e) {
        console.log(e.message)
        return response.status(500).send({status_code: 500, message: e.message})
    }
}
module.exports = update_user
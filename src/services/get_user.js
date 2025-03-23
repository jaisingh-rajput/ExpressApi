const jwt = require("jsonwebtoken");
const {connectDB, getDB} = require("../config/db");

const get_user = async function (request, response) {
    try {
        let authorization = request.header('authorization')
        const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        console.log(decoded)
        const db = getDB();
        const existingUser = await db.collection("Users").findOne({email: decoded.email, isActive: true});
        delete existingUser['password']
        return response.send({status_code: 200, message: "success", data: existingUser})
    } catch (e) {
        console.log(e.message)
        return response.status(500).send({status_code: 500, message: e.message})
    }
}
module.exports = get_user
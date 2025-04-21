import TokenService from "../Services/TokenService.js";

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(404).send({
            message: 'Token missing'
        });
    }
    try {
        await TokenService.decode(token);

        // Attach the user to the request object for later use (optional)
        //req.user = user;
        // Proceed to the next middleware/route handler
        next();
    } catch (e) {
        next(e);
    }
};

export default verifyToken;
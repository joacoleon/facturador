import TokenService from "../Services/TokenService";

const verifyToken = async (req, res, next) => {
    console.log("verify");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(404).send({
            message: 'Token missing'
        });
    }
    try {
        //const user = await TokenService.decode(token);

        // Attach the user to the request object for later use (optional)
        //req.user = user;
        // Proceed to the next middleware/route handler
        next();
    } catch (e) {
        next(e);
    }
};

export default verifyToken;
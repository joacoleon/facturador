export default {
    profile: async (req, res, next) => {
        try {
            // Access user details attached to the request (from the decoded token)
            //const user = req.user;

            res.status(200).json();
        } catch (e) {
            next(e);
        }
    },

}
import routerx from "express-promise-router";
import UserController from "../Controllers/UserController.js";
import verifyToken from "../Middlewares/Auth.js";

const router = routerx();
const controller = UserController;

router.get('/profile', verifyToken, controller.profile);

export default router;
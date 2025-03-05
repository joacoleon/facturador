import routerx from "express-promise-router";
import UserController from "../Controllers/UserController";
import verifyToken from "../Middlewares/Auth";

const router = routerx();
const controller = UserController;

router.get('/profile', verifyToken, controller.profile);

export default router;
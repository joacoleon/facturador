import routerx from "express-promise-router";
import UserRouter from "./User";

const router = routerx();

router.use('/user', UserRouter);

export default router;
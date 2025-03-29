import routerx from "express-promise-router";
import UserRouter from "./User.js";
import ConceptRouter from "./Concept.js";

const router = routerx();

router.use('/user', UserRouter);
router.use('/concept', ConceptRouter);

export default router;
import routerx from "express-promise-router";
import ConceptController from "../Controllers/ConceptController.js";
import verifyToken from "../Middlewares/Auth.js";

const router = routerx();
const controller = ConceptController;

router.post('/add', verifyToken, controller.add);
router.get('/list', verifyToken, controller.list);

export default router;
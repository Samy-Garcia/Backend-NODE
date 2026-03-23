import express from "express";
import branchesController from "../controllers/branchesController.js";

//Router() nos ayuda a colocar los metodos
//que vamo a usar
const router = express.Router();

router.route("/")
    .get(branchesController.getBranches)
    .post(branchesController.insertBranch)
router.route("/:id")
    .delete(branchesController.deleteBranch)
    .put(branchesController.updateBranch)

export default router;
import express from "express";
import wompiController from "../controllers/wompiController.js";

const router = express.Router();

router.route("/token").post(wompiController.generateToken);
router.route("/paymentTest").post(wompiController.paymentTest);
router.route("/payment3Ds").post(wompiController.payment3Ds);

export default router;
import express from "express";
import deliveriesController from "../controllers/deliveriesController.js";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
.get(deliveriesController.getAllDeliveries)
.post(upload.single("image"), deliveriesController.insertDelivery);

router.route("/:id")
.delete(deliveriesController.deleteDelivery)
.put(upload.single("image"), deliveriesController.updateDelivery);

export default router;
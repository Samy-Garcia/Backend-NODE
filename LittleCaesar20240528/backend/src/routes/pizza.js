import express from "express"
import pizzaController from "../controllers/pizzaController.js"
//Router nos ayuda a colocar los metodos
//que tendar el endpoint, como get, post, put, delete, etc.
const router = express.Router()

router.route("/")
.get(pizzaController.getPizzas)
.post(pizzaController.insertPizza)

router.route("/:id")
.put(pizzaController.updatePizza)
.delete(pizzaController.deletePizza) 

export default router

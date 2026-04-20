import express from "express";
import employeeController from "../controllers/employeesController.js";

//De la Libreria Express, importo el Router para crear Router()
//que es para colocar los metodos HTTP que voy a usar

const router = express.Router();

//Rutas para el CRUD de empleados
router.route("/")
    .get(employeeController.getEmployees)
    .post(employeeController.insertEmployee);

router.route("/:id")
    .delete(employeeController.deleteEmployee)
    .put(employeeController.updateEmployee);

export default router;
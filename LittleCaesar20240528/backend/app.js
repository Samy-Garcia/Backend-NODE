import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import branchRoutes from "./src/routes/branches.js"

//creo una constante app que es una instancia de express, esto me permite usar todas las funcionalidades de express para crear mi servidor y manejar rutas, middlewares, etc.

const app = express();

//para que la api acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/branches", branchRoutes);

export default app;
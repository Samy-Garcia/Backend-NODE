import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import branchRoutes from "./src/routes/branches.js"
import employeeRoutes from "./src/routes/employees.js"
import reviewRoutes from "./src/routes/reviews.js"
import customerRoutes from "./src/routes/customer.js"
import registerCustomerRoutes from "./src/routes/registerCustomer.js"
import registerEmployeeRoutes from "./src/routes/registerEmployee.js"
import loginCustomerRoutes from "./src/routes/loginCustomer.js"
import logoutRoutes from "./src/routes/logout.js"

import cookieParser from "cookie-parser"

//creo una constante app que es una instancia de express, esto me permite usar todas las funcionalidades de express para crear mi servidor y manejar rutas, middlewares, etc.

const app = express();
app.use(cookieParser());

//para que la api acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/registerEmployee", registerEmployeeRoutes);
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/logout", logoutRoutes);

export default app;
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

import customerModel from "../models/customers.js";


//Arrey de funciones
const loginCustomerController = {};

loginCustomerController.login = async (req, res) => {
    try {
        
        //1- solicitar
        const { email, password } = req.body;

        //2- vereficar que el email existe en la base de datos
        const customerFound = await customerModel.findOne({email})

        //si no existe
        if (!customerFound) {
            return res.status(400).json({message: "Customer not found"});
        }

        //Vereficamos que la cuenta no este bloqueada
        if ( customerFound.timeOut && customerFound.timeOut > Date.now()) {
            return res.status(403).json({message: "Account is blocked. Try again later."});
        }

        //validar la contraseña
        const isMatch = await bcrypt.compare(password, customerFound.password);

        //si la contraseña no es correcta
        if (!isMatch) {
            //sumar 1 al contador de intentos fallidos
            customerFound.loginAttempts = (customerFound.loginAttempts || 0) + 1;

            if (customerFound.loginAttempts >= 5) {
                customerFound.timeOut = Date.now() + 5 * 60 * 1000; // bloquea por 5 minutos
                customerFound.loginAttempts = 0; // resetear el contador de intentos

                await customerFound.save();

                return res.status(403).json({message: "Account is blocked due to too many failed login attempts. Try again later."});
            }

            await customerFound.save();

            return res.status(400).json({message: "Invalid password"});
        }

        //resetear el contador de intentos fallidos
        customerFound.loginAttempts = 0;
        customerFound.timeOut = null;

        //generar el token
        const token = jsonwebtoken.sign(
            //1-¿que vamos a guardar en el token?
            {id: customerFound._id, userType: "customer"},
            //2- secret key
            config.JWT.secret,
            //3- tiempo de expiracion del token
            { expiresIn: "30d" }
            
        );

        //el token se guarda en una cookie
        res.cookie("authCookie", token);

        return res.status(200).json({message: "Login successful"});



    } catch (error) {
        console.log("error", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export default loginCustomerController;
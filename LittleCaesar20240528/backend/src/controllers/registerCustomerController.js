import nodemailer from "nodemailer"; //envía correos electrónicos
import crypto from "crypto"; //genera tokens aleatorios
import jsonwebtoken from "jsonwebtoken"; //genera tokens JWT para autenticación
import bcryptjs from "bcryptjs"; //hashea contraseñas

import  config  from "../../config.js"; //importa configuración del proyecto, como la clave secreta para JWT

import customerModel from "../models/customers.js"; //modelo de cliente para interactuar con la base de datos


//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
    try {
        // 1 Solicitar datos a registrar
        let { name, lastName, birthDate, email, password, isVerified, loginAttemps, timeOut, } = req.body;

    // 2 Validar datos si ya existe la base de datos
    const existCustomer = await customerModel.findOne({ email });
    if (existCustomer) {
        return res.status(400).json({ message: 'Customer already exists' });
    }

        //encriptar contraseña
        const passwordHashed = await bcryptjs.hash(password, 10);
        
        //generar un codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex");

        //guardamos todo en un token
        const token = jsonwebtoken.sign(
            {
                randomCode,
                name,
                lastName,
                birthDate,
                email,
                password: passwordHashed,
                isVerified,
                loginAttemps,
                timeOut
            },
            //secret key
            config.JWT.secret,
            //tiempo de expiración del token
            { expiresIn: "15m" }

            );

             //guardamos el token en una cookie
            res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000}) 

            //ENVIAR CORREO DE VERIFICACIÓN
            //1. Transporter -> ¿quien lo envía?
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user:config.email.user_email,
                    pass: config.email.user_password,
                },
            });

            //2. mailOptions -> ¿quien lo recibe y como?
            const mailOptions = {
                from: config.email.user_email,
                to: email,
                subject: "Email verification",
                text: "para verificar tu correo, ingresa el siguiente código en la aplicación: " + randomCode + " expira en 15 minutos"

            };

            //3. Enviar el correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error")
                    return res.status(500).json({ message: 'Error sending email' });
                }
                return res.status(200).json({ message: 'Email sent successfully' });
            })
       
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }

};

//VERIFICAR EL CODIGO DE VERIFICACIÓN
registerCustomerController.verifyCode = async (req, res) => {
    try {
        //1. Solicitar el código de verificación en el frontend
        const { verificationCodeRequest} = req.body;

        //2. Obtener el token de la cookie
        const token = req.cookies.registrationCookie

        //extraer la información del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const {
            randomCode: storedCode,
            name,
            lastName,
            birthDate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut
        } = decoded

        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        //3. Guardar el cliente en la base de datos
        const newCustomer = new customerModel({
            name,
            lastName,
            birthDate,
            email,
            password,
            isVerified: true,
        });

        await newCustomer.save();

        //4. Eliminar la cookie
        res.clearCookie("registrationCookie");

        return res.status(200).json({ message: 'Customer registered successfully' });


    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default registerCustomerController;


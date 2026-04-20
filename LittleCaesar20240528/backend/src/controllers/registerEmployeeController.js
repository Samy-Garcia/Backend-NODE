import nodemailer from "nodemailer"; //envía correos electrónicos
import crypto from "crypto"; //genera tokens aleatorios
import jsonwebtoken from "jsonwebtoken"; //genera tokens JWT para autenticación
import bcryptjs from "bcryptjs"; //hashea contraseñas

import  config  from "../../config.js"; //importa configuración del proyecto, como la clave secreta para JWT

import EmployeesModel from "../models/employees.js";
import { error } from "console";

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
    try {
        
        let { name,
            lastName,
            DUI,
            birthDate,
            email,
            password,
            isVerified,
            status,
            idBranch
        } = req.body;

        //validar si el empleado ya existe
        const existEmployee = await EmployeesModel.findOne({ email });
        if (existEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
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
                DUI,
                birthDate,
                email,
                isVerified,
                status,
                idBranch
            },
            //secret key
            config.JWT.secret,
            //tiempo de expiracion del token 
            { expiresIn: "15m" }
        
        );

        //guardamos el token en una cookie

        res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000})

        //Enviar correo de verifica
        //1. Transporter -> ¿quien lo recibe y como?
        const transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });

        //2- mailOptions -> ¿quien lo recibe y como?
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verify your email",
            text: "para vereficar tu correo, ingresa el siguiente codigo en la aplicacion: " + randomCode + " expira en 15 minutos"
        }; 

        //3- enviar eñ correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error")
                return res.status(500).json({message: "Error sending email" })
            }
            return res.status(200).json({ message: "Email sent successfully" })
        })

    

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    

    }
}

//verificar el codigo de verificacion
registerEmployeeController.verifyCode = async (req, res) => {
    try {
        //1- solicitar el codigo de verificacion
        const { verificationCodeRequest} = req.body;

        //obtener el token de la cookie
        const token = req.cookies.registrationCookie;

        //extraer la informacion del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const {
            randomCode: storedCode,
            name,
            lastName,
            DUI,
            birthDate,
            email,
            isVerified,
            status,
            idBranch
        } = decoded

        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        //3- guardar el empleado en la base de datos

        const newEmployee = new EmployeesModel({
            name,
            lastName,
            DUI,
            birthDate,
            email,
            isVerified: true,
            status,
            idBranch
        });

        await newEmployee.save();

        return res.status(200).json({ message: "Employee registered successfully" });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default registerEmployeeController;

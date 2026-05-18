import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto, { verify } from "crypto";
import nodemailer from "nodemailer";

import HTMLRecoveryEmail from "../utils/sendMaildRecovery.js";

import { config } from "../../config.js";

import customerModel from "../models/customers.js";

//Array de funciones

const recoveryPasswordController = {}

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        //Solicitamos los datos
        const { email } = req.body;
        
        //validar que el email exista
        const userFound = await customerModel.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        //generar un codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //guardar el codigo en un token
        const token = jsonwebtoken.sign(
            //que vamos a guardar en el token
            { email, randomCode, userType: "customer", verify: false },
            //SECRET KEY
            config.JWT.secret,
            //tiempo de expiracion del token
            { expiresIn: "15m" }
            

        )

        res.cookie("recoveryToken", token, { maxAge: 15 * 60 * 1000 });

        //enviar el codigo por email

        //quien envia el email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        });

        //quien y como lo recibe
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Recovery code",
            text: "El vence en 15 minutos",
            html: HTMLRecoveryEmail(randomCode)
        };

        //enviar el emaiL
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email", error);
                return res.status(500).json({ message: "Error sending email" });
            }
            return res.status(200).json({ message: "Recovery code sent to email" });

        });


    } catch (error) {
        console.log("Error"+error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


recoveryPasswordController.verifyCode = async (req, res) => {
    try {
        
        //Solicitamos los datos
        const { code } = req.body;


        //obtener el token de las cookies
        //acceder a las cookies
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        //ahora vamos a comparar el codigo que nos envio el usuario con el codigo que esta en el token
        if (code !== decoded.randomCode) {
            return res.status(400).json({ message: "Invalid code" });
        }

        //en cambio si el codigo es correcto
        //vamos a colocar en el token que el codigo ya fue verificado

        const newToken = jsonwebtoken.sign(
            //que vamos a guardar en el token
            { email: decoded.email, userType: "customer", verify: true },
            //SECRET KEY
            config.JWT.secret,
            //tiempo de expiracion del token
            { expiresIn: "15m" }
        );

        res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

        return res.status(200).json({ message: "Code verified" });

    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

recoveryPasswordController.newPassword = async (req, res) => {
    try {

        const {newPassword, confirmPassword} = req.body;

        //comaparo las contraseñas
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        //vamos a comparar que la constante verified que esta en el token
        //ya esta en true (o haya pasado por el paso 2)

        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        if (!decoded.verify) {
            return res.status(400).json({ message: "Code not verified" });
        }

        //encriptar la nueva contraseña

        const passwordHash = await bcrypt.hash(newPassword, 10)

        //actualizar la contraseña en la base de datos

        await customerModel.findOneAndUpdate(
            { email: decoded.email },
            { password: passwordHash },
            {new: true }
        );

        res.clearCookie("recoveryCookie");

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default recoveryPasswordController;


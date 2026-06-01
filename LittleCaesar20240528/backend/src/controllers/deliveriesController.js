import deliveriesModel from "../models/deliveries.js";
import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../../config.js";


//array de funciones
const deliveriesController = {};

//SELECT
deliveriesController.getAllDeliveries = async (req, res) => {

    try {
        
        const deliveries = await deliveriesModel.find();
        res.json(deliveries);

    } catch (error) {
        console.log("error"+error);
        res.status(500).json({message: "Internal Server Error"});  
    }

};

//INSERT

deliveriesController.insertDelivery = async (req, res) => {
    try {
    
        const {name, phone, cars, isActive} = req.body;

        const newDelivery = new deliveriesModel({
            name,
            phone,
            image: req.file.path,
            public_id: req.file.filename,
            cars,
            isActive
        });

        await newDelivery.save();

        res.status(200).json({message: "Delivery created successfully"});

    } catch (error) {
        console.log("error"+error);
        res.status(500).json({message: "Internal Server Error"});  
    }
};

//DELETE
deliveriesController.deleteDelivery = async (req, res) => {
    try {   
        const deliveryFound = await deliveriesModel.findById(req.params.id);

        // Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(deliveryFound.public_id);

        // Eliminar el registro de la base de datos
        const deletedDelivery = await deliveriesModel.findByIdAndDelete(req.params.id);

        if (!deletedDelivery) {
            return res.status(404).json({message: "Delivery not found"});
        }

        res.status(200).json({message: "Delivery deleted successfully"});

    } catch (error) {
        console.log("error"+error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//UPDATE
deliveriesController.updateDelivery = async (req, res) => {
    try {
        const {name, phone, cars, isActive} = req.body;
        
        //Identificar el registro a actualizar
        const deliveryFound = await deliveriesModel.findById(req.params.id);

        const updateData = {
            name,
            phone,
            cars,
            isActive
        };

        //si viene una imagen
        if (req.file) {
            // Eliminar la imagen anterior de Cloudinary
            await cloudinary.uploader.destroy(deliveryFound.public_id);
            // Agregar la nueva imagen
            updateData.image = req.file.path;
            updateData.public_id = req.file.filename;
        }

        //Actualizar el registro en la base de datos
        await deliveriesModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        )

        if (!updatedDelivery) {
            return res.status(404).json({message: "Delivery not found"});
        }

        res.status(200).json({message: "Delivery updated successfully"});

    } catch (error) {
        console.log("error"+error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export default deliveriesController;
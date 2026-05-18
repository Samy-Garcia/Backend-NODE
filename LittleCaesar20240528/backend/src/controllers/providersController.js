import providersModel from "../models/providers.js";

import {v2 as cloudinary} from "cloudinary";

//Array de funciones
const providersController = {}

//SELLECT
providersController.getAllProviders = async (req, res) => {
    try {
        const providers = await providersModel.find();
        res.status(200).json(providers);
    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({message: "Internal server error"});
    }

}

//INSERT
providersController.insertProvider = async (req, res) => {
    try {
        
        //solicito los datos a guardar
        const {name, phone} = req.body;

        const newProvider = new providersModel({
            name,
            phone,
            image: req.file.path,
            public_id: req.file.filename,
        });

        await newProvider.save();

        return res.status(200).json({message: "Providers saved"})

    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({message: "Internal server error"});    
    }
}

//UPDATE
providersController.updateProvider = async (req, res) => {
    try {
        //solicito los datos
        const {name, phone} = req.body;

        //identifico a quien estoy actualixando
        const providerFound = await providersModel.findById(req.param.id)

        const updatedData = {
            name,
            phone
        }

        //si viene alguna imagen
        if(req.file){
            //eliminar la imagen anterior
            await cloudinary.uploader.destroy(providerFound.public_id)
            
            //guardar la nueva imagen
            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        //actualizo en la base de datos
        await providersModel.findByIdAndUpdate(req.params.id,
            updatedData,
            {new: true});

        return res.status(200).json({message: "Provider updated"})

    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({message: "Internal server error"});    
    }
};

//DELETE
providersController.deleteProvider = async (req, res) => {
    try {
        
        const providerFound = await providersModel.findById(req.params.id);

        if (!providerFound) {
            return res.status(404).json({message: "Provider not found"});
        }

        // Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(providerFound.public_id);

        // Eliminar el proveedor de la base de datos
        await providersModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({message: "Provider deleted"});

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({message: "Internal server error"});
    }
}


export default providersController;
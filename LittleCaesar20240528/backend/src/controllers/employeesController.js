// -1 Creo un arrey de funciones
const employeesController = {};

// - 2 importo el Schema de la collecion que voy a usar
import EmployeesModel from "../models/employees.js";

//SELECT
employeesController.getEmployees = async (req, res) => {
    try {
        const employees = await EmployeesModel.find();
        return res.status(200).json(employees);
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});  
    }
}


//DELETE
employeesController.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await EmployeesModel.findByIdAndDelete(req.params.id);

        //si no se elimina
        if (!deletedEmployee) {
            return res.status(404).json({message: "Employee not found"});
        }


        return res.status(200).json({message: "Employee deleted successfully"});
    }
    catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});
    }
}

//UPDATE
employeesController.updateEmployee = async (req, res) => {
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

        //VALIDACIONES
     //Sanitizar
        name = name?.trim();
        email = email?.trim();
        password = password?.trim();

        //campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({message: "Field required"});
        }

        //longitud de caracteres
        if (name.length < 3 || name.length > 20) {
            return res.status(400).json({message: "Name must be between 3 and 20 characters"});
        }

        //validacion de fecha de nacimiento
        if (birthDate > new Date() || birthDate < new Date("1910-01-01")) {
            return res.status(400).json({message: "Invalid birth date"});
        }

        //DUI
        if (DUI.length > 10 || DUI.length < 9) {
            return res.status(400).json({message: "Invalid DUI"});
        }

        const updatedEmployee = await EmployeesModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            DUI,
            birthDate,
            email,
            password,
            isVerified,
            status,
            idBranch
        }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({message: "Employee not found"});
        }

        return res.status(200).json({message: "Employee updated successfully"});
    }
    catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});
    }

};

export default employeesController;
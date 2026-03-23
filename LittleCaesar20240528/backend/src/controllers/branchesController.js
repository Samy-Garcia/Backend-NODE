//crear un arrey de funciones vacio
const branchesController = {};

//importo el Schema de la collecion que voy a usar
import BranchesModel from "../models/branches.js";

//SELECT
branchesController.getBranches = async (req, res) => {
    const branches = await BranchesModel.find();
    res.json(branches); 
}

//INSERT
branchesController.insertBranch = async (req, res) => {
    //solicitud de datos a usar
    const { name, address, schedule, isActive } = req.body;
    //lleno el Schena con los datos
    const newBranch = new BranchesModel({name, address, schedule, isActive});
    //guardo el nuevo documento en la base de datos
    await newBranch.save();
    res.json({message: "Branch inserted successfully"});
}

//ELIMINAR
branchesController.deleteBranch = async (req, res) => {
    await BranchesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Branch deleted successfully"});
}   

//ACTUALIZAR
branchesController.updateBranch = async (req, res) => {
    //solicitud los nuevos datos a usar
    const { name, address, schedule, isActive } = req.body;
//actualiza
    await BranchesModel.findByIdAndUpdate(req.params.id, {
         name,
        address,
         schedule,
          isActive
        },
        {new: true}
    );
    res.json({message: "Branch updated successfully"});
};

export default branchesController;
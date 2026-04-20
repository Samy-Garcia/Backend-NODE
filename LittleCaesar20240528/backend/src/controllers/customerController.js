import customerModel from '../models/customers.js';

//creo un arrey de funciones

const customerController = {};


//SELECT
customerController.getAllCustomers = async (req, res) => {
    try {
        const customers = await customerModel.findAll();  
        return res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    };
};


//UPDATE
customerController.updateCustomer = async (req, res) => {
    try {
        // 1 Solicitar todos los datos nuevos
        let { name, lastName, birthDate, email, password, isVerified} = req.body;

        //Validar
        //Sanitizar
        name = name.trim();
        email = email.trim();

        //validar campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //longitud de campos
        if (name.length < 3 || name.length > 15) {
            return res.status(400).json({ message: 'Name must be between 3 and 15 characters' });
        }

        //Actualizar el cliente
        const customerUpdated = await customerModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            birthDate,
            email,
            password,
            isVerified
        }, { new: true });

        if (!customerUpdated) {
            return res.status(404).json({ message: 'Customer not found' });
        }



        return res.status(200).json({message: 'Customer updated successfully'});

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//DELETE
customerController.deleteCustomer = async (req, res) => {
    try {
        const customerDeleted = await customerModel.findByIdAndDelete(req.params.id);

        if (!customerDeleted) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        return res.status(200).json({ message: 'Customer deleted successfully' });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default customerController;
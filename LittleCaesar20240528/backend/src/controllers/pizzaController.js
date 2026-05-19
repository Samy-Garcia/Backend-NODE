//aqui en el controlador
//vamos a definir las funciones
//que ejecutaran los metodos get, post, put, delete, etc.

//paso 1- Crear un arrey de metodos
const pizzaController = {};

//impoto el schema que voy a utilizar

import pizzaModel from "../models/pizzas.js";

//SELECT
pizzaController.getPizzas = async (req, res) => {
 const pizzas = await pizzaModel.find();
    res.json(pizzas);
}

//INSERT
pizzaController.insertPizza = async (req, res) => {
    //Solicitar los datos que se van a guardar
    const {name, description, price, stock} = req.body;
    //Guardo en el model
    const newPizza = new pizzaModel({
        name,
        description,
        price,
        stock
    });
    //Guardar en la base de datos
     await newPizza.save();

     res.json({message: "Pizza insertada correctamente" });   
}

//DELETE
pizzaController.deletePizza = async (req, res) => {
    await pizzaModel.findByIdAndDelete(req.params.id);
    res.json({message: "Pizza eliminada correctamente" });
}

//UPDATE
pizzaController.updatePizza = async (req, res) => {
    //Solicitar los datos que se van a actualizar
    const {name, description, price, stock} = req.body;
    //Actualizar en la base de datos
    await pizzaModel.findByIdAndUpdate(req.params.id, {
        name,
        description,
        price,
        stock
    }, {new: true});
    res.json({message: "Pizza actualizada correctamente" });
};

//obtener spolo un registro
pizzaController.getPizzasById = async (req, res) => {
    try {
        
        const pizza = await pizzaModel.findById(req.params.id);
        if(!pizza){
            return res.status(404).json({message: "Pizza no encontrada"});
        }

        return res.status(200).json(pizza);

    } catch (error) {
        console.log("error"+ error)
        return res.status(500).json({message: "Error al obtener la pizza"});
    }
};

//obtener pizzas con stock bajo
pizzaController.getLowStock = async (req, res) => {
    try {
        
        const pizzas = await pizzaModel.find({stock: {$lt:5}})

        if(!pizzas) {
            return res.status(404).json({message: "no hay pizzas con stock bajo"})
        }

        return res.status(200).json(pizzas)

    } catch (error) {
        console.log("error"+ error)
        return res.status(500).json({message: "Internal Server Error"}); 
    }
}

//SELECT CON FILTRO
pizzaController.getPizzasByPriceRange = async (req, res) => {
    try {
        
        const {min, max} = req.body;

        const pizzas = await pizzaModel.find({
            price: {$gte: min, $lte: max}
        })

        if(!error) {
            return re.status(404).json({message: "no hay pizzas con este rango de precio"})
        }

        return res.status(200).json(pizzas)

    } catch (error) {
        console.log("error"+ error)
        return res.status(500).json({message: "internal Server Error"});
    }
}


//contar cuantos elementos tengo
pizzaController.countPizzas = async (req, res) => {
    try{
    const count = await pizzaModel.countDocuments;

    return res.status(200).json(count)

    } catch (error){

        console.log("error"+ error)
        return res.status(500).json({message: "internal Server Error"});
    }

};

//buscar por nombre
pizzaController.searchByName = async (req, res) => {
    try {
        //solicitar los datos
        const {name} = req.body

        const pizzas = await pizzaModel.find({
            name: {$regex: name, $options: "i"}
        })

        if(!pizzas) {
            return res.status(404).json({message: "Pizza no existe"})
        }

    } catch (error) {
        console.log("error"+ error)
        return res.status(500).json({message: "internal Server Error"});
    }
}



export default pizzaController;
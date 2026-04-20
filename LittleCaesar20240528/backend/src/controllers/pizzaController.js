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

export default pizzaController;
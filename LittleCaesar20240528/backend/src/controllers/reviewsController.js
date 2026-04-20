const reviewController = {};

import Review from '../models/reviews.js';


//SELECT
reviewController.getReviews = async (req, res) => {
    try {
            const reviews = await Review.find();
            return res.status(200).json(reviews);
        } catch (error) {
            console.log("error"+error);
            return res.status(500).json({message: "Internal server error"});  
        }
}

//INSERT
reviewController.insertReview = async (req, res) => {
    try {
        let { idEmployee, idPizza, rating, comment } = req.body;

        //VALIDACIONES
        //Sanitizar

        if (rating < 1 || rating > 5) {
            return res.status(400).json({message: "Rating must be between 1 and 5"});
        }

        if (comment < 4 || comment > 500) {
            return res.status(400).json({message: "Comment must be between 4 and 500 characters"});
        }

        const newReview = new Review({
            idEmployee,
            idPizza,
            rating,
            comment
        });

        await newReview.save();
        return res.status(201).json({message: "Review created successfully"});

    }   
    catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});  
    }
}

//DELETE
reviewController.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({message: "Review not found"});
        }
        return res.status(200).json({message: "Review deleted successfully"});
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});
    }
}

//UPDATE
reviewController.updateReview = async (req, res) => {
    try {
     
        let { idEmployee, idPizza, rating, comment } = req.body;   
          //VALIDACIONES
        //Sanitizar 
        rating = rating?.trim();

        if (rating < 1 || rating > 5) {
            return res.status(400).json({message: "Rating must be between 1 and 5"});
        }

         if (comment < 4 || comment > 500) {
            return res.status(400).json({message: "Comment must be between 4 and 500 characters"});
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, {
            idEmployee,
            idPizza,
            rating,
            comment
        }, { new: true });
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});    
    }
}

export default reviewController;
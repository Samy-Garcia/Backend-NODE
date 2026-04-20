//array de funciones

const logoutController = {};

logoutController.logout = async (req, res) => {
    // Clear the authentication cookie
    res.clearCookie("authCookie");

    // Send a success response
    return res.status(200).json({message: "Logout successful"});
};

export default logoutController;
import User from "../models/user.model.js"

export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
};


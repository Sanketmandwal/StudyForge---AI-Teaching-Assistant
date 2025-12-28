import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPaths";

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
        console.log('Response data:', response.data);
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
}

const register = async (email, password, username) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { email, password, username });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Registration failed" };
    }
}

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch profile" };
    }
}

const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Profile update failed" };
    }
}

const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Password change failed" };
    }
}

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
}

export default authService

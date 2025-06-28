import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slice/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        const logoutUserFromStorage = async () => {
            try {
                await dispatch(logoutUser());
                toast.success("Logged out successfully!");
                navigate("/");
            } catch (error) {
                console.error("Logout error:", error);
                toast.error("Logout failed. Please try again.");
                navigate("/dashboard");
            }
        };
        
        logoutUserFromStorage();
    }, [dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <LogOut className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent animate-pulse">
                    Logging out...
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Please wait while we sign you out
                </p>
            </div>
        </div>
    );
};

export default Logout;
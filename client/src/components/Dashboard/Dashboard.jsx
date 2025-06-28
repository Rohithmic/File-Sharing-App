import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import SideBar from "./SideBar";
import StatesGrid from "./StatesGrid";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import UserProfile from "./UserProfile";
import { 
  Home, 
  Upload, 
  FolderOpen, 
  User, 
  Settings,
  BarChart3,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back, {user?.fullname || user?.username || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Here's what's happening with your files today
              </p>
            </div>
            <StatesGrid />
          </div>
        );
      case "upload":
        return <UploadPage />;
      case "files":
        return <FileShow />;
      case "profile":
        return <UserProfile />;
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your file performance and insights
              </p>
            </div>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed analytics and insights will be available in the next update.
              </p>
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Activity Log
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View your recent file activities and actions
              </p>
            </div>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Activity Log Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your file uploads, downloads, and sharing activities.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your account preferences and configurations
              </p>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced settings and preferences will be available soon.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back, {user?.fullname || user?.username || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Here's what's happening with your files today
              </p>
            </div>
            <StatesGrid />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Loading Screen */}
      {!user && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

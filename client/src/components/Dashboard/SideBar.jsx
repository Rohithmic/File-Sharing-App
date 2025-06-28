import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { logoutUser } from "../../redux/slice/auth/authSlice";
import { toast } from "react-toastify";
import { 
  Home, 
  Upload, 
  FolderOpen, 
  User, 
  Settings,
  BarChart3,
  Activity,
  Menu,
  X,
  LogOut
} from "lucide-react";

const SideBar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      description: "Dashboard overview"
    },
    {
      id: "upload",
      label: "Upload Files",
      icon: Upload,
      description: "Upload new files",
      badge: "New"
    },
    {
      id: "files",
      label: "My Files",
      icon: FolderOpen,
      description: "Manage your files"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "User profile"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "View analytics"
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      description: "Activity log"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "App settings"
    }
  ];

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    try {
      dispatch(logoutUser());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Snedz
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">File Sharing</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.fullname?.charAt(0) || user?.username?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.fullname || user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "gradient" : "ghost"}
                className={`
                  w-full justify-start h-12 px-4 group transition-all duration-200
                  ${isActive 
                    ? "text-white shadow-lg" 
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon className={`
                  w-5 h-5 mr-3 transition-transform duration-200
                  ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
                  ${isActive ? "scale-110" : "group-hover:scale-105"}
                `} />
                <div className="flex-1 text-left">
                  <div className="flex items-center">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`
                    text-xs mt-0.5 transition-colors duration-200
                    ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-500"}
                  `}>
                    {item.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              © 2024 Snedz
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;

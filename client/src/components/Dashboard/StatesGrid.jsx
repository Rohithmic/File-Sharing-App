import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  Download, 
  Image, 
  Video, 
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  User,
  Settings
} from "lucide-react";

const StatesGrid = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: "Total Files",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
      color: "blue",
      description: "from last month"
    },
    {
      title: "Total Downloads",
      value: "5,678",
      change: "+8%",
      changeType: "positive",
      icon: Download,
      color: "green",
      description: "from last month"
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      change: "24%",
      changeType: "neutral",
      icon: Image,
      color: "purple",
      description: "of 10 GB total"
    },
    {
      title: "Active Shares",
      value: "89",
      change: "12",
      changeType: "warning",
      icon: Users,
      color: "orange",
      description: "expiring soon"
    }
  ];

  const quickActions = [
    {
      title: "Upload Files",
      description: "Share new files with password protection",
      icon: FileText,
      color: "blue",
      action: "Upload Now"
    },
    {
      title: "View Analytics",
      description: "Track your file performance and insights",
      icon: TrendingUp,
      color: "green",
      action: "View Stats"
    },
    {
      title: "Manage Profile",
      description: "Update your account settings and preferences",
      icon: User,
      color: "purple",
      action: "Edit Profile"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        icon: "bg-blue-100 dark:bg-blue-900/40",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800"
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        icon: "bg-green-100 dark:bg-green-900/40",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800"
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        icon: "bg-purple-100 dark:bg-purple-900/40",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800"
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        icon: "bg-orange-100 dark:bg-orange-900/40",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : stat.changeType === "warning" ? (
                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                  ) : null}
                  <span className={`text-sm ${
                    stat.changeType === "positive" ? "text-green-600 dark:text-green-400" :
                    stat.changeType === "warning" ? "text-orange-600 dark:text-orange-400" :
                    "text-gray-600 dark:text-gray-400"
                  }`}>
                    {stat.change} {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Profile Card */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {user?.fullname || user?.username || "User"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email || "user@example.com"}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="success" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro Member
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color);
          
          return (
            <Card key={index} className={`border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${colors.border} border-l-4`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {action.description}
                    </p>
                    <Button variant="ghost" size="sm" className={`${colors.text} hover:${colors.bg}`}>
                      {action.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* File Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              File Type Distribution
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Overview of your uploaded files by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">45%</span>
                  <Badge variant="info">234 files</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mr-3">
                    <Image className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">32%</span>
                  <Badge variant="success">167 files</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center mr-3">
                    <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Videos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">23%</span>
                  <Badge variant="warning">89 files</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your latest file uploads and downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Presentation.pptx uploaded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
                <Badge variant="info">2.3 MB</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Report.pdf downloaded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
                <Badge variant="success">1.8 MB</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Video.mp4 uploaded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
                <Badge variant="warning">45.2 MB</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatesGrid;

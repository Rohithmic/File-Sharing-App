import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles } from "../../redux/slice/file/fileThunk";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Download,
  Eye,
  Share2,
  Copy,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  QrCode,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Upload
} from "lucide-react";

const FileShow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getUserFiles(user.id));
    }
  }, [user, dispatch]);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'expired': return 'destructive';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = (url) => {
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=File%20Share&body=Here's%20your%20file:%20${encodeURIComponent(url)}`,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=150x150`,
    };
  };

  if (!files || files.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Files Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't uploaded any files yet. Start sharing your files to see them here.
          </p>
          <Button variant="gradient" className="group">
            <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Upload Your First File
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            My Files
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and share your uploaded files
          </p>
        </div>
        <Badge variant="info" className="text-sm">
          {files.length} file(s)
        </Badge>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files?.map((file) => {
          const FileIcon = getFileIcon(file.type);
          const shareLinks = handleShare(file.shortUrl);
          const isExpired = differenceInDays(new Date(file.expiresAt), new Date()) <= 0;
          
          return (
            <Card key={file._id} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                {/* File Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(file.status)} className="text-xs">
                      {file.status}
                    </Badge>
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>

                {/* File Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Downloads</span>
                      <span className="font-medium">{file.downloadedContent || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Type</span>
                      <span className="font-medium">{file.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Uploaded</span>
                      <span className="font-medium">
                        {formatDistanceToNowStrict(new Date(file.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewFile(file)}
                      className="flex-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShareFile(file)}
                      className="flex-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(file.shortUrl)}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Copy link"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <Eye className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  File Preview
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewFile(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {previewFile.name} - {formatFileSize(previewFile.size)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <iframe
                  src={previewFile.path}
                  title="File Preview"
                  className="w-full h-96 border-0 rounded"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setPreviewFile(null)}
                >
                  Close
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => window.open(previewFile.shortUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Full View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Modal */}
      {shareFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                  <Share2 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Share File
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShareFile(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Share "{shareFile.name}" with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Share Link */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Link</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareFile.shortUrl}
                    readOnly
                    className="flex-1 text-sm bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-gray-100"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(shareFile.shortUrl)}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share via:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(handleShare(shareFile.shortUrl).whatsapp, '_blank')}
                    className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(handleShare(shareFile.shortUrl).facebook, '_blank')}
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(handleShare(shareFile.shortUrl).email, '_blank')}
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(shareFile.shortUrl, '_blank')}
                    className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    Direct Link
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">QR Code</p>
                <img
                  src={handleShare(shareFile.shortUrl).qr}
                  alt="QR Code"
                  className="mx-auto border rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FileShow;

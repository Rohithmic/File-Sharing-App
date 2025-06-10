import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAxios } from './utils/axios';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card';
import { File, Download, Lock, AlertCircle } from 'lucide-react';

const FileDownload = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await publicAxios.get(`/api/files/${code}`);
        setFile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'File not found');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [code]);

  const handleDownload = async () => {
    if (!file) return;

    setDownloading(true);
    setError('');

    try {
      const response = await publicAxios.post(`/api/files/download/${file._id}`, {
        password: password,
      });

      window.location.href = response.data.downloadUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!file) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">File Download</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <File className="w-12 h-12 text-primary" />
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          {file.isPasswordProtected && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                <span>Password Required</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          {file.hasExpiry && (
            <div className="text-sm text-gray-500">
              Expires: {new Date(file.expiresAt).toLocaleString()}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleDownload}
            disabled={downloading || (file.isPasswordProtected && !password)}
            className="w-full"
          >
            {downloading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FileDownload;    
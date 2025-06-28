import { File } from '../models/file.models.mjs';
import s3 from "../config/s3.mjs";
import bcrypt from "bcryptjs";
import AWS from "aws-sdk";
import nodemailer from "nodemailer";
import shortid from "shortid";
import QRCode from "qrcode";
import { User } from '../models/user.models.mjs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const { isPassword, password, hasExpiry, expiresAt, userId } = req.body;

  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const savedFiles = [];
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    for (const file of req.files) {
      const originalName = file.originalname;
      const extension = path.extname(originalName);
      const uniqueSuffix = shortid.generate();
      const finalFileName = `${originalName.replace(/\s+/g, '_')}_${uniqueSuffix}${extension}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `file-share-app/${finalFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const s3Result = await s3.upload(params).promise();
        const fileUrl = s3Result.Location;
        const shortCode = shortid.generate();

        const fileObj = {
          path: fileUrl,
          name: finalFileName,
          type: file.mimetype,
          size: file.size,
          hasExpiry: hasExpiry === 'true',
          expiresAt: hasExpiry === 'true'
            ? new Date(Date.now() + expiresAt * 3600000)
            : new Date(Date.now() + 10 * 24 * 3600000),
          status: 'active',
          shortUrl: `${process.env.BASE_URL}/f/${shortCode}`,
          shortCode: shortCode,
          createdBy: userId,
        };

        if (isPassword === 'true') {
          const hashedPassword = await bcrypt.hash(password, 10);
          fileObj.password = hashedPassword;
          fileObj.isPasswordProtected = true;
        }

        const newFile = new File(fileObj);
        const savedFile = await newFile.save();
        savedFiles.push(savedFile);

        // Update user stats
        user.totalUploads += 1;
        if (file.mimetype.startsWith('image/')) user.imageCount += 1;
        else if (file.mimetype.startsWith('video/')) user.videoCount += 1;
        else if (file.mimetype.startsWith('application/')) user.documentCount += 1;
      } catch (uploadError) {
        console.error("Error uploading to S3:", uploadError);
        return res.status(500).json({ 
          message: "File upload failed", 
          error: uploadError.message,
          details: "Error uploading to S3"
        });
      }
    }

    await user.save();

    return res.status(201).json({
      message: "Files uploaded successfully",
      fileIds: savedFiles.map(f => f._id),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      message: "File upload failed", 
      error: error.message,
      details: "Server error during file upload"
    });
  }
};

export const downloadFile = async (req, res) => {
    const { fileId } = req.params;
    const { password } = req.body;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

         if (file.status !== 'active') {
          return res.status(403).json({ error: 'This file is not available for download' });
        }

        if (file.expiresAt && new Date(file.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This file has expired' });
    }

       if (file.isPasswordProtected) {
      if (!password) {
        return res.status(401).json({ error: 'Password required' });
      }

      const isMatch = await bcrypt.compare(password, file.password);
      if (!isMatch) {
        return res.status(403).json({ error: 'Incorrect password' });
      }
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const key = `file-share-app/${file.name}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 24 * 60 * 60,
    };

    const downloadUrl = s3.getSignedUrl('getObject', params);
    if (!downloadUrl) {
        return res.status(500).json({ error: 'Error generating download URL' });
    }

    file.downloadedContent++;
    await file.save();

    // Update user download count
    const user = await User.findById(file.createdBy);
    if (user) {
      user.totalDownloads += 1;
      await user.save();
    }

    return res.status(200).json({ downloadUrl });
       
    }catch (error) {
        console.error("Download error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteFile = async (req, res) => {
     const { fileId } = req.params;

     try {
        const file = await File.findById(fileId);

        if(!file){
          return res.status(404).json({error:'File not found'});
        }

        if(file.status==='deleted'){
          return res.status(400).json({error:'File already deleted'});
        }

        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        });

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `file-share-app/${file.name}`
        };

        await s3.deleteObject(params).promise();
        
        await File.deleteOne({ _id: fileId });

        return res.status(200).json({message:'File deleted successfully'});
     }catch(error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
     }
};

export const updateFileStatus = async (req, res) => {
    const { fileId } = req.params;
    const { status } = req.body;
    try {
        const file = await File.findByIdAndUpdate(fileId, { status }, { new: true });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Update file status error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateFileExpiry = async (req, res) => {
    const { fileId, expiresAt } = req.body;
    try {
        const file = await File.findByIdAndUpdate(fileId, { 
            expiresAt: new Date(Date.now() + expiresAt * 3600000),
            hasExpiry: true 
        }, { new: true });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Update file expiry error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateFilePassword = async (req, res) => {
    const { fileId, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const file = await File.findByIdAndUpdate(fileId, { 
            password: hashedPassword,
            isPasswordProtected: true 
        }, { new: true });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Update file password error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchFiles = async (req, res) => {
    const { query } = req.query;
    try {
        const files = await File.find({
            name: { $regex: query, $options: 'i' }
        }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error("Search files error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const showUserFiles = async (req, res) => {
    try {
        // This would typically get files for the authenticated user
        // For now, return all files
        const files = await File.find().sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error("Show user files error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getFileDetails = async (req, res) => {
    const { fileId } = req.params;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Get file details error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const generateShareShortenLink = async (req, res) => {
    const { fileId } = req.body;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        const shortCode = shortid.generate();
        file.shortCode = shortCode;
        file.shortUrl = `${process.env.BASE_URL}/f/${shortCode}`;
        await file.save();
        res.status(200).json({ shortUrl: file.shortUrl });
    } catch (error) {
        console.error("Generate share link error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const sendLinkEmail = async (req, res) => {
    const { fileId, email } = req.body;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Email sending logic would go here
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Send link email error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const generateQR = async (req, res) => {
    const { fileId } = req.params;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        const qrCode = await QRCode.toDataURL(file.shortUrl);
        res.status(200).json({ qrCode });
    } catch (error) {
        console.error("Generate QR error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getDownloadCount = async (req, res) => {
    const { fileId } = req.params;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json({ count: file.downloadedContent });
    } catch (error) {
        console.error("Get download count error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const resolveShareLink = async (req, res) => {
    const { code } = req.params;
    console.log('Received code:', code);
    try {
        const file = await File.findOne({ shortCode: code });
        console.log('File found:', file);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Check if file has expired
        if (file.hasExpiry && new Date(file.expiresAt) < new Date()) {
            return res.status(410).json({ error: 'This file has expired' });
        }
        // Check if file is active
        if (file.status !== 'active') {
            return res.status(403).json({ error: 'This file is not available' });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error("Resolve share link error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const verifyFilePassword = async (req, res) => {
    const { fileId, password } = req.body;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        if (!file.isPasswordProtected) {
            return res.status(400).json({ error: 'File is not password protected' });
        }
        const isMatch = await bcrypt.compare(password, file.password);
        if (!isMatch) {
            return res.status(403).json({ error: 'Incorrect password' });
        }
        res.status(200).json({ message: 'Password verified' });
    } catch (error) {
        console.error("Verify file password error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserFiles = async (req, res) => {
    const { userId } = req.params;
    try {
        const files = await File.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error("Get user files error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const migrateShortCodes = async (req, res) => {
    try {
        // Find all files that have shortUrl but no shortCode
        const filesToMigrate = await File.find({ 
            shortUrl: { $exists: true, $ne: null },
            shortCode: { $exists: false }
        });
        
        let migratedCount = 0;
        
        for (const file of filesToMigrate) {
            // Extract shortCode from shortUrl
            const urlParts = file.shortUrl.split('/');
            const shortCode = urlParts[urlParts.length - 1];
            
            if (shortCode) {
                file.shortCode = shortCode;
                await file.save();
                migratedCount++;
            }
        }
        
        res.status(200).json({ 
            message: `Migration completed. ${migratedCount} files updated.`,
            migratedCount 
        });
    } catch (error) {
        console.error("Migration error:", error);
        res.status(500).json({ error: 'Migration failed' });
    }
}; 
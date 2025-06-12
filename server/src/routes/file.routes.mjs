import express from "express";
import { upload } from "../middlewares/upload.middlewares.mjs";
import {
  uploadFiles,
  downloadFile,
  deleteFile,
  updateFileStatus,
  updateFileExpiry,
  updateFilePassword,
  searchFiles,
  showUserFiles,
  getFileDetails,
  generateShareShortenLink,
  sendLinkEmail,
  generateQR,
  getDownloadCount,
  resolveShareLink,
  verifyFilePassword,
  getUserFiles,
} from "../controllers/file.controller.mjs";
import { verifyToken } from "../middlewares/auth.middlewares.mjs";

const router = express.Router();

router.post("/upload", upload.array('files'), uploadFiles);
router.post("/download/:fileId", downloadFile);
router.delete("/delete/:fileId", deleteFile);
router.put("/update/:fileId", updateFileStatus);
router.get("/getFileDetails/:fileId", getFileDetails);
router.post('/generateShareShortenLink', generateShareShortenLink);
router.post('/sendLinkEmail', sendLinkEmail);

router.post('/updateFileExpiry', updateFileExpiry);
router.post('/updateFilePassword', updateFilePassword);
router.get('/searchFiles', searchFiles);
router.get('/showUserFiles', showUserFiles);

router.get('/generateQR/:fileId', generateQR);
router.get('/getDownloadCount/:fileId', getDownloadCount);

router.get('/resolveShareLink/:code', resolveShareLink);
router.post('/verifyFilePassword', verifyFilePassword);

router.get('/getUserFiles/:userId', getUserFiles);

export default router;
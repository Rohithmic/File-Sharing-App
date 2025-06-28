import express from "express";
import upload from "../middlewares/upload.middlewares.mjs";
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
  migrateShortCodes,
} from "../controllers/file.controller.mjs";

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

// Place this before the catch-all /:code route to avoid conflicts
router.get('/resolveShareLink/:code', resolveShareLink);
router.get('/:code', resolveShareLink);
router.post('/verifyFilePassword', verifyFilePassword);

router.get('/getUserFiles/:userId', getUserFiles);

router.post('/migrate', migrateShortCodes);

export default router;
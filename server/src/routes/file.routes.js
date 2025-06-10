const express = require("express");
const { Router } = express;
const upload = require("../middlewares/upload.middlewares");
const { 
    deleteFile, 
    downloadFile, 
    generateQR, 
    generateShareShortenLink, 
    getDownloadCount, 
    getFileDetails, 
    getUserFiles, 
    resolveShareLink, 
    searchFiles, 
    sendLinkEmail, 
    showUserFiles, 
    updateFileExpiry, 
    updateFilePassword, 
    updateFileStatus, 
    uploadFiles, 
    verifyFilePassword 
} = require("../controllers/file.controller");

const router = Router();

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

module.exports = router;
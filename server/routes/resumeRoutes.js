import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createResume, deleteResume, getResumeById,getpublicResumeById , updateResume } from '../controllers/resumeController.js';
import upload from '../configs/multer.js';
import imageKit from '../configs/imageKit.js';



const resumeRouter = express.Router();
resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update' ,upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId' , protect, deleteResume);
resumeRouter.get('/get/:resumeId' , protect, getResumeById);
resumeRouter.get('/public/:resumeId' , getpublicResumeById );

// Certificate upload route
resumeRouter.post('/upload/certificate', protect, upload.single('certificate'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No certificate file provided' });
        }

        // Upload to ImageKit
        const uploadOptions = {
            file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
            folder: "certificates",
        };

        const uploadedCertificate = await imageKit.files.upload(uploadOptions);

        res.json({
            message: 'Certificate uploaded successfully',
            url: uploadedCertificate.url
        });
    } catch (error) {
        console.error('Certificate upload error:', error);
        res.status(500).json({ message: 'Failed to upload certificate' });
    }
});

export default resumeRouter;
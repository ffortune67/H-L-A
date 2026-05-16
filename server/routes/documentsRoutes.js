const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getDocumentCategories,
    getAdminDocuments
} = require('../controllers/documentsController');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/documents'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|docx?|xlsx?|zip|txt|jpe?g|png/i;
        const extname = allowedTypes.test(path.extname(file.originalname));
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, Word, Excel, ZIP, TXT, JPG, PNG are allowed.'));
        }
    }
});

// Public routes
router.get('/', getDocuments);
router.get('/categories', getDocumentCategories);
router.get('/:id', getDocumentById);
router.get('/:id/download', downloadDocument);

// Admin routes
router.post('/', authenticateToken, upload.single('file'), uploadDocument);
router.get('/admin/list', authenticateToken, getAdminDocuments);
router.put('/:id', authenticateToken, updateDocument);
router.delete('/:id', authenticateToken, deleteDocument);

module.exports = router;

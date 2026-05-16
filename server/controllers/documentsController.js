const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get all downloadable documents
const getDocuments = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, title, description, category, file_type, file_size, download_count, 
                   created_at, uploaded_by, file_url
            FROM downloadable_documents
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ' AND category = $' + (params.length + 1);
            params.push(category);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as count FROM downloadable_documents WHERE 1=1';
        const countParams = [];

        if (category) {
            countQuery += ' AND category = $' + (countParams.length + 1);
            countParams.push(category);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            documents: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get document by ID
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM downloadable_documents WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.json({
            success: true,
            document: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Upload document
const uploadDocument = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const uploaded_by = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title and category are required'
            });
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (req.file.size > maxSize) {
            fs.unlinkSync(req.file.path); // Delete uploaded file
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 50MB limit'
            });
        }

        // Get file extension
        const fileExt = path.extname(req.file.originalname).slice(1).toLowerCase();
        const allowedTypes = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'zip', 'txt', 'jpg', 'jpeg', 'png'];

        if (!allowedTypes.includes(fileExt)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: `File type .${fileExt} not allowed`
            });
        }

        // Store file path (relative to public folder)
        const fileUrl = `/uploads/documents/${req.file.filename}`;

        // Insert into database
        const result = await pool.query(
            `INSERT INTO downloadable_documents 
            (title, description, category, file_url, file_type, file_size, uploaded_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [title, description || '', category, fileUrl, fileExt, req.file.size, uploaded_by]
        );

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: result.rows[0]
        });
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Upload document error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Update document metadata
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;

        const result = await pool.query(
            `UPDATE downloadable_documents 
            SET title = COALESCE($1, title), 
                description = COALESCE($2, description), 
                category = COALESCE($3, category)
            WHERE id = $4 
            RETURNING *`,
            [title || null, description || null, category || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.json({
            success: true,
            message: 'Document updated',
            document: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Delete document
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Get document to find file path
        const docResult = await pool.query(
            'SELECT file_url FROM downloadable_documents WHERE id = $1',
            [id]
        );

        if (docResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete from database
        await pool.query('DELETE FROM downloadable_documents WHERE id = $1', [id]);

        // Delete physical file
        const filePath = path.join(__dirname, '../../public', docResult.rows[0].file_url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({
            success: true,
            message: 'Document deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Download document (increment counter)
const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Get document
        const result = await pool.query(
            'SELECT file_url, title FROM downloadable_documents WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        const { file_url, title } = result.rows[0];

        // Increment download count
        await pool.query(
            'UPDATE downloadable_documents SET download_count = download_count + 1 WHERE id = $1',
            [id]
        );

        // Send file
        const filePath = path.join(__dirname, '../../public', file_url);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(filePath, title, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get document categories
const getDocumentCategories = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT category FROM downloadable_documents 
             ORDER BY category`
        );

        res.json({
            success: true,
            categories: result.rows.map(r => r.category)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all documents (with download stats)
const getAdminDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT d.*, 
                   (SELECT first_name || ' ' || last_name FROM users WHERE id = d.uploaded_by) as uploader
            FROM downloadable_documents d
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ' AND category = $' + (params.length + 1);
            params.push(category);
        }

        query += ' ORDER BY d.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Count total
        let countQuery = 'SELECT COUNT(*) as count FROM downloadable_documents WHERE 1=1';
        const countParams = [];
        if (category) {
            countQuery += ' AND category = $' + (countParams.length + 1);
            countParams.push(category);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            documents: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Get admin documents error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getDocumentCategories,
    getAdminDocuments
};

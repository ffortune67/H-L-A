const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
    getBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    publishBlogPost,
    archiveBlogPost,
    deleteBlogPost,
    getAdminBlogPosts,
    getCategories,
    getTags
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogPosts);
router.get('/post/:slug', getBlogPostBySlug);
router.get('/categories', getCategories);
router.get('/tags', getTags);

// Admin routes (protected)
router.post('/', authenticateToken, createBlogPost);
router.get('/admin/posts', authenticateToken, getAdminBlogPosts);
router.put('/:id', authenticateToken, updateBlogPost);
router.post('/:id/publish', authenticateToken, publishBlogPost);
router.post('/:id/archive', authenticateToken, archiveBlogPost);
router.delete('/:id', authenticateToken, deleteBlogPost);

module.exports = router;

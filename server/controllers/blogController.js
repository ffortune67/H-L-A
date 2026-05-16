const pool = require('../config/db');
const slugify = require('slugify');

// Helper to create slug from title
const createSlug = (title) => {
    return slugify(title, {
        lower: true,
        strict: true,
        replacement: '-'
    });
};

// Get all published blog posts with pagination
const getBlogPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, search } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, title, slug, excerpt, featured_image_url, category, tags, 
                   status, published_at, view_count, created_at, 
                   (SELECT first_name || ' ' || last_name FROM users WHERE id = blog_posts.author_id) as author
            FROM blog_posts 
            WHERE status = 'published'
        `;
        const params = [];

        if (category) {
            query += ' AND category = $' + (params.length + 1);
            params.push(category);
        }

        if (tag) {
            query += ` AND $${params.length + 1} = ANY(tags)`;
            params.push(tag);
        }

        if (search) {
            query += ` AND (title ILIKE $${params.length + 1} OR excerpt ILIKE $${params.length + 1})`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as count FROM blog_posts WHERE status = $1';
        const countParams = ['published'];

        if (category) {
            countQuery += ' AND category = $2';
            countParams.push(category);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            posts: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Get blog posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single blog post by slug
const getBlogPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await pool.query(
            `SELECT b.*, 
                    (SELECT first_name || ' ' || last_name FROM users WHERE id = b.author_id) as author,
                    (SELECT email FROM users WHERE id = b.author_id) as author_email
             FROM blog_posts b 
             WHERE slug = $1 AND status = 'published'`,
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        const post = result.rows[0];

        // Increment view count
        await pool.query(
            'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
            [post.id]
        );

        res.json({
            success: true,
            post: {
                ...post,
                view_count: post.view_count + 1
            }
        });
    } catch (error) {
        console.error('Get blog post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Create blog post (draft)
const createBlogPost = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, featured_image_url } = req.body;
        const author_id = req.user.id;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const slug = createSlug(title);

        // Check if slug already exists
        const existingSlug = await pool.query(
            'SELECT id FROM blog_posts WHERE slug = $1',
            [slug]
        );

        if (existingSlug.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'A post with this title already exists'
            });
        }

        const result = await pool.query(
            `INSERT INTO blog_posts 
            (title, slug, content, excerpt, category, tags, featured_image_url, author_id, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [title, slug, content, excerpt || '', category || '', tags || [], featured_image_url || '', author_id, 'draft']
        );

        res.status(201).json({
            success: true,
            message: 'Blog post created (draft)',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Create blog post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Update blog post
const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, category, tags, featured_image_url, status } = req.body;

        // Get current post
        const currentPost = await pool.query(
            'SELECT * FROM blog_posts WHERE id = $1',
            [id]
        );

        if (currentPost.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Only allow draft or published status
        const finalStatus = status && ['draft', 'published', 'archived'].includes(status) ? status : currentPost.rows[0].status;

        // Create new slug if title changed
        let slug = currentPost.rows[0].slug;
        if (title && title !== currentPost.rows[0].title) {
            slug = createSlug(title);

            // Check if new slug already exists
            const existingSlug = await pool.query(
                'SELECT id FROM blog_posts WHERE slug = $1 AND id != $2',
                [slug, id]
            );

            if (existingSlug.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'A post with this title already exists'
                });
            }
        }

        const publishedAt = finalStatus === 'published' && !currentPost.rows[0].published_at ? new Date() : currentPost.rows[0].published_at;

        const result = await pool.query(
            `UPDATE blog_posts 
            SET title = $1, slug = $2, content = $3, excerpt = $4, category = $5, 
                tags = $6, featured_image_url = $7, status = $8, published_at = $9, updated_at = NOW()
            WHERE id = $10 
            RETURNING *`,
            [
                title || currentPost.rows[0].title,
                slug,
                content || currentPost.rows[0].content,
                excerpt !== undefined ? excerpt : currentPost.rows[0].excerpt,
                category || currentPost.rows[0].category,
                tags || currentPost.rows[0].tags,
                featured_image_url || currentPost.rows[0].featured_image_url,
                finalStatus,
                publishedAt,
                id
            ]
        );

        res.json({
            success: true,
            message: 'Blog post updated',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Update blog post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Publish blog post
const publishBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE blog_posts 
            SET status = 'published', published_at = NOW(), updated_at = NOW()
            WHERE id = $1 
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post published',
            post: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Archive blog post
const archiveBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE blog_posts 
            SET status = 'archived', updated_at = NOW()
            WHERE id = $1 
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post archived',
            post: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Delete blog post
const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all blog posts (including drafts and archived)
const getAdminBlogPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, title, slug, excerpt, category, status, published_at, view_count, created_at, updated_at,
                   (SELECT first_name || ' ' || last_name FROM users WHERE id = blog_posts.author_id) as author
            FROM blog_posts
        `;
        const params = [];

        if (status) {
            query += ' WHERE status = $1';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Count total
        let countQuery = 'SELECT COUNT(*) as count FROM blog_posts';
        const countParams = [];
        if (status) {
            countQuery += ' WHERE status = $1';
            countParams.push(status);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            posts: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Get admin blog posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get blog categories
const getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT category FROM blog_posts 
             WHERE status = 'published' AND category != ''
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

// Get all tags
const getTags = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT UNNEST(tags) as tag FROM blog_posts 
             WHERE status = 'published'
             ORDER BY tag`
        );

        res.json({
            success: true,
            tags: result.rows.map(r => r.tag)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};

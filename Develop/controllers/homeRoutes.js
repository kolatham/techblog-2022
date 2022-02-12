const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth =require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      
      const blogData = await Blog.findAll({
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });


      const blogs = blogData.map((blog) => blog.get({ plain: true}));


      res.render('homepage', { 
        blogs, 
        loggedIn: req.session.loggedIn 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get('/blog/:id', async (req, res) => {
    try {
      const blogData = await Blog.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
    
    const blog =blogData.get ({ plain: true});
    
    const commentData = await Comment.findAll({
        where: {
            blog_id: req.params.id
        }
    });

    const comments =JSON.parse(JSON.stringify(commentData));

    res.render('blog', {
        ...blog,
        comments,
        loggedIn: req.session.loggedIn
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get('/dashboard', withAuth, async (req, res) => {
    try {
    
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Blog }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        loggedIn: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;
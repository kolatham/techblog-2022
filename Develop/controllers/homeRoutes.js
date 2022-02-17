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
      console.log(blogs);


      res.render('homepage', { 
        blogs, 
        logged_in: req.session.logged_in 
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
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get('/dashboard', withAuth, async (req, res) => {
    try {
    console.log(req.session.user_id)
      const userData = await Blog.findAll(
        {where:{user_id: req.session.user_id,}, 
        // attributes: { exclude: ['password'] },
        include: [Comment],
      });
      console.log(userData)
      if (userData.length!== 0){
        const blogs = userData.map((blog) => {return blog.dataValues});
        console.log(blogs);
  
      res.render('dashboard', {
        user: req.session.user,
        logged_in: true,
        blogs: blogs
      });
      }else{
        console.log(req.session)
        res.render('dashboard', {
          user: req.session,
          logged_in: true,
          blogs: []

        })
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/login', (req, res) => {
    
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;
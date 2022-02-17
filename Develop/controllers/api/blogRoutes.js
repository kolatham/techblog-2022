const router = require('express').Router();
const { Comment, Blog, User } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', async (req, res) => {
  try {
    
    const commentData = await Comment.findAll({
      include: [
        {
          model: Comment,
          attributes: ['comment_text'],
        },
      ],
    });

    
    const comments = commentData.map((comment) => comment.get({ plain: true }));


    res.render('blog', { 
      comments, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  console.log("hit")
  try {
    console.log("try")
    const blogContent = req.body
    blogContent.user_id =req.session.user_id
    console.log(blogContent)

    const newBlog = await Blog.create(
      blogContent
    );

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
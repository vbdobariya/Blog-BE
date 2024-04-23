const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { isAuth } = require("../middleware/authMiddleware");

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", isAuth, blogController.createBlog);
router.put("/:id", isAuth, blogController.updateBlog);
router.delete("/:id", isAuth, blogController.deleteBlog);

router.put("/:id/comment", isAuth, blogController.blogCommentController);
router.put("/:id/like", isAuth, blogController.blogLikeController);

module.exports = router;

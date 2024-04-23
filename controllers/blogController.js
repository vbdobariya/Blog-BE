const Blog = require("../models/Blog");

// Get a all blog
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    blogs.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "-password"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, imageUrl, videoUrl, gifUrl } = req.body;
    const data = imageUrl || videoUrl || gifUrl
    if (!title | !description | !data) {
      return res.status(500).send({
        message: "please provide all fields",
        success: false,
      });
    }

    await Blog.create({
      title,
      description,
      imageUrl,
      videoUrl,
      gifUrl,
      author: req.user._id,
      authorname: req.user.username
    });
    res.status(201).send({
      message: "Blog created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, imageUrl, videoUrl, gifUrl } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, videoUrl, gifUrl },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.blogCommentController = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(201).json({ success: false, message: "No comments yet." });
    }

    const blog = await Blog.findById(req.params.id);

    const review = {
      username: req.user.username,
      comment,
      user: req.user._id,
    };

    blog.comment.push(review);

    await blog.save();

    res.status(201).send({
      success: true,
      message: "Comment Added!",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Comment API",
      error,
    });
  }
};

exports.blogLikeController = async (req, res) => {
  try {
    const { like } = req.body;

    if (like === undefined || like === null) {
      return res.status(201).json({ success: false, message: "No comments yet." });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (like === true) {
      const likes = {
        username: req.user.username,
        user: req.user._id,
      };

      blog.likesUser.push(likes);
      blog.likes += 1;
    }

    if (like === false) {
      const existingLikeIndex = blog.likesUser.findIndex(like => like.user.toString() === req.user._id.toString());
      blog.likesUser.splice(existingLikeIndex, 1);
      if (blog.likes !== 0) {
        blog.likes -= 1;
      }
    }


    await blog.save();

    res.status(201).send({
      success: true,
      message: "Blog liked successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Comment API",
      error,
    });
  }
};


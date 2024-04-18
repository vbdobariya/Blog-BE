const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a blog by ID
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
      author: req.userId,
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

// Update a blog by ID
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

// Delete a blog by ID
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

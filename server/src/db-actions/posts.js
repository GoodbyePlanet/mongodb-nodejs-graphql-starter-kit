const Post = require('../models/Post');
const { Developer } = require('../models/Developer');
const { PermissionError } = require('../validation/AuthErrors');
const LOGGER = require('../logger/logger');

const getPosts = async () => await Post.find({});

const createPost = async postData => {
  try {
    const developer = await Developer.findById(postData.author);

    return await new Post({ ...postData, author: developer }).save();
  } catch (error) {
    LOGGER.error('Error while creating post', error);
  }
};

const updatePost = async (id, updatedPost, loggedInDeveloper) => {
  try {
    const post = await Post.findById(id);

    if (post.author._id.toString() !== loggedInDeveloper) {
      const Error = PermissionError('Not permitted to update resource!');
      throw new Error();
    }

    return await Post.findByIdAndUpdate(
      id,
      { ...updatedPost, author: post.author },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  } catch (error) {
    LOGGER.error('Error while updating post ', error);
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
};

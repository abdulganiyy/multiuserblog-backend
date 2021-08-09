const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  title: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coverPhoto: String,
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: Date,
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      body: String,
      createdAt: Date,
    },
  ],
});

module.exports = model("Post", postSchema);

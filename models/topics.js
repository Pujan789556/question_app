const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique : true
  },
  parent: {
    type: String,
  }
});

TopicSchema.index({"topic": 1});
TopicSchema.index({"topic": 1, "parent": 1});

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;
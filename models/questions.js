const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  qn: {
    type: Number,
    required: true,
  },
  annotation: {
    type: [String],
    validate: [(str) => str.length, 'Must have at lease one annotation'],
  },
});

QuestionSchema.index({"qn": 1, "annotation": 1});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
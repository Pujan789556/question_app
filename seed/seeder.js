const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const Question = require('../models/questions');
const Topic = require('../models/topics');

dotenv.config();
const uri = process.env.MONGOSTRING;
mongoose
  .connect(uri)
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db");
    var topicsRow = [];
    fs.createReadStream(path.resolve(__dirname, 'topic.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => topicsRow.push(row))
    .on('end', rowCount => {
        Topic.deleteMany({}, () => {
            topicsRow.map(async (item, index) => {
              var topicData = {};
              Object.keys(item).map(async (key,keyindex) => {
                  if(item[key] && item[key] !== '') {
                    topicData.topic = item[key];
                    topicData.parent = item[Object.keys(item)[keyindex -1]] || null;
                    const topicSchemaData = new Topic(topicData); 
                    await topicSchemaData.save((err, result) => {
                    if(err) console.log("Error seeding topics", err);
                    else console.log("Seeded topic", topicSchemaData.topic)
                  })}
                })
              if (index === topicsRow.length - 1) {
                console.log("All Topic Seeded!");
              }
            });
        });
      })

    var questionsRow = [];
    fs.createReadStream(path.resolve(__dirname, 'question.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => questionsRow.push(row))
    .on('end', rowCount => {
      Question.deleteMany({}, () => {
        questionsRow.map(async (item, index) => {
            var questionData = {};
            for(var q in item) {
                if(q !== '' && q === 'Question number') {
                    questionData.qn = item[q]
                } else if(q !== '') {
                    if(!questionData.annotation) questionData.annotation = [];
                    questionData.annotation.push(item[q])
                }
            }
            const questionSchemaData = new Question(questionData);
            await questionSchemaData.save((err, result) => {
              if(err) console.log("Error seeding question", err);
              else console.log("Seeded question", questionSchemaData.qn)
              if (index === questionsRow.length - 1) {
                console.log("All Question Seeded!");
              }
            });
          });
        });
    });
  });
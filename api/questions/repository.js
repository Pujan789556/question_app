const Question = require("../../models/questions");
const Topic = require("../../models/topics");

const searchQuestion = (queryString) => new Promise(async (resolve, reject) => {
    try {
        var allTopic = [queryString];
        const _getChildrenTopics = async (topic) => {
            const childrenTopic = await Topic.find({
                'parent': {
                    $eq: topic
                }
            })
            childrenTopic.map(child => {
                allTopic = [...allTopic, child.topic];
                _getChildrenTopics(child.topic);
            })
        }
        await _getChildrenTopics(queryString);
        const questions = await Question.find({
            'annotation': {
                $in: allTopic
            }
        })
        const questionNumbers = questions.map(question => question.qn); 
        resolve(questionNumbers); 
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    searchQuestion
}
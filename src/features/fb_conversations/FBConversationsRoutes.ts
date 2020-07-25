import express from 'express';
import { answerControllerIns } from './answers/AnswerController';
import { commentControllerIns } from './comments/CommentController';
import { expertControllerIns } from './experts/ExpertController';
import { fbConversationControllerIns } from './FBConversationController';
import { questionControllerIns } from './questions/QuestionController';
import { topicControllerIns } from './topics/TopicController';

export class FBConversationsRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();

        router.get('/topic-type/:id', topicControllerIns.getTopic);
        router.get('/:topicId/experts', expertControllerIns.getExpertsByTopic);
        router.get('/experts/topic-wise/:userId', expertControllerIns.getListOfExpertiseTopics);
        router.post('/experts/seen', expertControllerIns.markTopicExpertsSeen);
        router.get('/bookmarked-topics', topicControllerIns.getBookmarkedTopics);
        router.get('/bookmarked-topics/:topicTypeId/:topicNameStr?', topicControllerIns.getBookmarkedTopicsWithFilters);
        router.get('/bookmarked-topics-all/:topicTypeId', topicControllerIns.getBookmarkedTopicsMonthWise);
        router.get('/:id', topicControllerIns.getTopicDetails);

        router.get('/metadata/topic-types', topicControllerIns.getPopularTopicTypes);
        router.get('/metadata/user', topicControllerIns.getUserTopicMetadata);
        router.get('/metadata/user/topic-types', topicControllerIns.getTopicTypeLookUp);
        router.post('/', topicControllerIns.createUserTopic);
        router.get('/', topicControllerIns.searchTopic);

        /**
         * question related routes
         */
        router.post('/:topicId/questions', questionControllerIns.addQuestion);
        router.put('/:topicId/questions/:questionId', questionControllerIns.updateQuestion);
        router.get('/:topicId/questions', questionControllerIns.getQuestionList);
        router.delete('/:topicId/questions/:questionId', questionControllerIns.deleteQuestion);
        router.get('/:topicId/questions-answers', questionControllerIns.getQuestionWithMostVotedAnswers);
        return router;
    }

    public static setRoutesForFBConversations() {
        const router: express.Router = express.Router();
        router.post('/ask-question', questionControllerIns.askQuestion);
        router.post('/entity-action', fbConversationControllerIns.entityActionAdd); //
        router.get('/quest-discussions', fbConversationControllerIns.getQuestDiscussionTaskDetails);
        router.get('/buddy-quest-discussions', fbConversationControllerIns.getBuddyQuestDiscussionDetails);
        router.get('/quest-discussions-earn', fbConversationControllerIns.getDiscussionNFrequentlyAskedQuestionsNAnswers); //
        router.delete('/entity-action/:entityType/:entityActionType/:entityOriginId', fbConversationControllerIns.entityActionDelete); // :entityType/:actionType/:entityOriginId
        return router;
    }

    public static setRoutesForAnswers() {
        const router: express.Router = express.Router();
        /**
         * answer related routes
         */
        router.post('/:questionId/answers', answerControllerIns.addAnswer);
        router.get('/:questionId/answers', answerControllerIns.getAnswerList);
        router.get('/:questionId/answers/:answerId', answerControllerIns.getAnswerNQuestionByQuestionId);
        router.put('/:questionId/answers/:answerId', answerControllerIns.updateAnswer);
        router.delete('/:questionId/answers/:answerId', answerControllerIns.deleteAnswer);
        router.get('/fillers', questionControllerIns.getQuestionFillers);
        router.get('/followed/:questionStr?', questionControllerIns.getQuestionsFollowedByYou);
        router.get('/answered-by-you', answerControllerIns.getAnswersGivenByYou);
        router.get('/topics-experts-in', questionControllerIns.getQuestionsOfTopicYouAreExpertIn);
        return router;
    }

    public static setRoutesForComments() {
        const router: express.Router = express.Router();
        /**
         * answer related routes
         */
        router.post('/comments', commentControllerIns.addComment);
        router.get('/comments/:topicId/:commentId', commentControllerIns.getCommentList);
        router.put('/comments/:commentId', commentControllerIns.updateComment);
        router.delete('/comments/:commentId', commentControllerIns.deleteComment);
        return router;
    }
}

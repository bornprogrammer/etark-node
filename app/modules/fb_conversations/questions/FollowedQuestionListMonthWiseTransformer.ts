import { Transformer } from '@app/collections/Transformer';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';

class FollowedQuestionListMonthWiseTransformer implements Transformer {

    public doTransform(item: any) {
        return this.getFollowedQuestionObj(item);
    }

    private getFollowedQuestionObj = (item) => {
        const topicObj = { topic_id: item.topic_id, topic_name: item.topic_name, question: item.question, question_id: item.question_id, followed_at: item.entity_created_at, answer_count_since_last_seen: item.new_answer_count, topic_banner_image_url: urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image) };
        return topicObj;
    }
}

export const followedQuestionListMonthWiseTransformerIns = (): FollowedQuestionListMonthWiseTransformer => {
    return new FollowedQuestionListMonthWiseTransformer();
};

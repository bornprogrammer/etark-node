
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { url } from 'inspector';
import { topicBannerImageUrlTransformerIns } from '@app/collections/TopicBannerImageUrlTransformer';
import { appendTopicImageUrlTransformerIns } from '@app/collections/AppendTopicImageUrlTransformer';
import { userProfileUrlAppendTransformerIns } from '@app/collections/UserProfileUrlAppendTransformer';

class TopicDetailTransformer {

    private items: any;
    private changed: any;
    constructor(items: any) {
        this.items = items;
        this.changed = {};
    }

    public transform() {
        if (inputHelperIns.isInputValid(this.items[0])) {
            const topicDetails = this.items[0][0];
            this.changed = { topic_id: topicDetails.topic_id, topic_name: topicDetails.topic_name, is_bookmarked_by_you: topicDetails.is_bookmarked > 0, experts_count: topicDetails.experts_count, dish_tags: [], expert_details: this.items[1], topic_type_name: topicDetails.topic_type_name, is_bookmarked_pns_subscribed: topicDetails.topic_subscribed_id != null, topic_images: [] };
            let i = 0;
            this.items[0].forEach((item, index) => {
                if (item.metadata.dish_tag_id) {
                    this.changed.dish_tags.push(item.dish_tag_name);
                }
                if (item.metadata.image && i < 6) {
                    const imageObj: any = { topic_image: item.metadata.image };
                    appendTopicImageUrlTransformerIns.doTransform(imageObj);
                    this.changed.topic_images.push(imageObj.topic_image_url);
                    i++;
                }
                if (inputHelperIns.isArrayValidNNotEmpty(this.items[1]) && this.changed.expert_details[index]) {
                    userProfileUrlAppendTransformerIns.doTransform(this.changed.expert_details[index]);
                }
            });
        }
        return this.changed;
    }
}

export const topicDetailTransformerIns = (items: any): TopicDetailTransformer => {
    return new TopicDetailTransformer(items);
};

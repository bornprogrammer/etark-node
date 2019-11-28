import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { url } from 'inspector';

class BookmarkedTopicsListTransformer {

    private items: any;
    private changed: any;
    constructor(items: any) {
        this.items = items;
        this.changed = {};
    }

    public transform() {

        if (inputHelperIns.isInputValid(this.items)) {

            this.items.forEach((item) => {
                if (item.topic_type_id in this.changed === false) {
                    this.changed[item.topic_type_id] = { topic_type_id: item.topic_type_id, topic_type_name: item.topic_type_name, bookmarked_topic_counts: 1, is_view_all: false, topics: [] };
                } else {
                    this.changed[item.topic_type_id].bookmarked_topic_counts++;
                }
                if (this.changed[item.topic_type_id].bookmarked_topic_counts <= 3) {
                    this.pushTopicObj(item);
                } else {
                    this.changed[item.topic_type_id].is_view_all = true;
                }
            });
        }
        return Object.values(this.changed);
    }

    private pushTopicObj = (item) => {
        const topicObj = { topic_id: item.topic_id, topic_name: item.topic_name, experts_count: item.experts_count, discussion_counts: item.discussion_counts, topic_banner_image_url: urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image) };
        const topicArray = this.changed[item.topic_type_id].topics;
        topicArray.push(topicObj);
    }
}

export const bookmarkedTopicsListTransformerIns = (items: any): BookmarkedTopicsListTransformer => {
    return new BookmarkedTopicsListTransformer(items);
};

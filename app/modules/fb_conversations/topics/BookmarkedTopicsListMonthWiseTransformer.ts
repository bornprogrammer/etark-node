import { Transformer } from '@app/collections/Transformer';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { ChronologicalTypeEnum } from '../../../enums/ChronologicalTypeEnum';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';

class BookmarkedTopicsListMonthWiseTransformer implements Transformer {

    public doTransform(item: any) {
        return this.getTopicObj(item);
    }

    private getTopicObj = (item) => {
        const topicObj = { topic_id: item.topic_id, topic_name: item.topic_name, experts_count: item.experts_count, discussion_counts: item.discussion_counts, topic_banner_image_url: urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image) };
        return topicObj;
    }
}

export const bookmarkedTopicsListMonthWiseTransformerIns = (): BookmarkedTopicsListMonthWiseTransformer => {
    return new BookmarkedTopicsListMonthWiseTransformer();
};

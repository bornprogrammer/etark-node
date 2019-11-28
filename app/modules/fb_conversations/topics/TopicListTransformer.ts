import { Transformer } from '@app/collections/Transformer';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';

class TopicListTransformer implements Transformer {

    public doTransform(item: any) {
        item.is_bookmarked = item.bookmarked_id !== 0 ? 1 : 0;
        item.topic_banner_image_url = urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image);
    }
}

export const topicListTransformerIns = new TopicListTransformer();

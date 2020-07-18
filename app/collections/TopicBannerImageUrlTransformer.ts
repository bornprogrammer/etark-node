import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { Transformer } from './Transformer';
class TopicBannerImageUrlTransformer implements Transformer {

    public doTransform(item: any) {
        item.topic_banner_image_url = urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image);
    }
}

export const topicBannerImageUrlTransformerIns = new TopicBannerImageUrlTransformer();

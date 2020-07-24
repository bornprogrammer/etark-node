import { Transformer } from '@app/collections/Transformer';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';

export class ExpertiseTopicsListTransformer implements Transformer {

    public doTransform(item: any) {
        item.is_topic_expert_new = item.is_topic_expert_seen === 0;
        item.topic_banner_image_url = urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image);
    }
}

export const expertiseTopicsListTransformerIns = new ExpertiseTopicsListTransformer();

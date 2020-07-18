import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { Transformer } from './Transformer';
class AppendTopicImageUrlTransformer implements Transformer {

    public doTransform(item: any) {
        item.topic_image_url = urlHelperIns.appendTopicBannerImageUrl(item.topic_image);
    }
}

export const appendTopicImageUrlTransformerIns = new AppendTopicImageUrlTransformer();

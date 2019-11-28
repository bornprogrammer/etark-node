import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { Transformer } from './Transformer';
class AppendDishImageUrlTransformer implements Transformer {

    public doTransform(item: any) {
        item.dish_image_url = urlHelperIns.appendTopicBannerImageUrl(item.dish_image);
    }
}

export const appendDishImageUrlTransformerIns = new AppendDishImageUrlTransformer();

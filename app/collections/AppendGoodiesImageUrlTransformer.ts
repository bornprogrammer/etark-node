import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { Transformer } from './Transformer';
class AppendGoodiesImageUrlTransformer implements Transformer {

    public doTransform(item: any) {
        item.goodies_image_url = urlHelperIns.appendGoodiesImageUrl(item.goodies_image);
    }
}

export const appendGoodiesImageUrlTransformerIns = new AppendGoodiesImageUrlTransformer();

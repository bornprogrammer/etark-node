import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { Transformer } from './Transformer';

export class UserProfileUrlAppendTransformer implements Transformer {

    public doTransform(item: any): void {
        item.user_profile_url = urlHelperIns.appendUserProfileUrl(item.profile);
    }
}

export const userProfileUrlAppendTransformerIns = new UserProfileUrlAppendTransformer();

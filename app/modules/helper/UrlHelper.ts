import { inputHelperIns } from './InputHelper';

export class UrlHelper {

    public appendUserProfileUrl(imgName: string) {
        let userUrl = null;
        if (inputHelperIns.isInputValid(imgName)) {
            userUrl = 'https://foodybuddyrik.s3.amazonaws.com/uploads/profile/' + imgName;
        }
        return userUrl;
    }

    public appendTopicBannerImageUrl(imgName: string) {
        let dishUrl = null;
        if (inputHelperIns.isInputValid(imgName)) {
            dishUrl = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads/gallery/' + imgName;
        }
        return dishUrl;
    }

    public appendGoodiesImageUrl(imgName: string) {
        let goodiesUrl = null;
        if (inputHelperIns.isInputValid(imgName)) {
            goodiesUrl = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads/event/' + imgName;
        }
        return goodiesUrl;
    }

}

export const urlHelperIns = new UrlHelper();

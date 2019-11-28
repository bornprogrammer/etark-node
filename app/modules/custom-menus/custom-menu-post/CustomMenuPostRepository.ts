import PostedCustomMenuHub from '@app/modules/custom-menus/custom-menu-post/PostedCustomMenuHubModel';
import PostedCustomMenu from '@app/modules/custom-menus/custom-menu-post/PostedCustomMenuModel';
import PostedCustomMenuTimings from '@app/modules/custom-menus/custom-menu-post/PostedCustomMenuTimingModel';
import PostedCustomMenuUser from '@app/modules/custom-menus/custom-menu-post/PostedCustomMenuUserModel';
import BaseRepository from '@app/repositories/BaseRepository';

export default class CustomMenuPostRepository extends BaseRepository {

    constructor() {
        super();
    }

    public post(attr: any) {
        // TODO
        return PostedCustomMenu.create(attr);
    }

    public postInHub(attr: any) {
        return PostedCustomMenuHub.create(attr);

    }

    public postForUsers(attr: any) {
        return PostedCustomMenuUser.create(attr);
    }

    public postDeliveryDetails(attr: any) {
        return PostedCustomMenuTimings.create(attr);

    }

}
export const customMenuPostRepository = new CustomMenuPostRepository();

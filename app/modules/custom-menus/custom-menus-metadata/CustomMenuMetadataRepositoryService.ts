import Logger from '@app/services/Logger';
import CustomMenuRepository from '../CustomMenuRepository';

export default class CustomMenuService {

    public constructor(private customMenu: CustomMenuRepository) {
        this.customMenu = customMenu;
    }

    public doesUserHaveCustomMenu = async (userId: string) => {

    }

    public customMenuCount = async (userId: string) => {

    }

    public customMenuOrderCount = async (userId: string) => {

    }

    public getfaq = async () => {

    }

}

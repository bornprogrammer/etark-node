import Logger from '@app/services/Logger';
import CustomMenuRepository from '../CustomMenuRepository';

export default class CustomMenuService {

    public constructor(private customMenuRepository: CustomMenuRepository) {
        this.customMenuRepository = customMenuRepository;
    }

}

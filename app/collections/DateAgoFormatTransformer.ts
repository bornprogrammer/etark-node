import { DateHelper } from '@app/modules/helper/DateHelper';
import { Transformer } from './Transformer';

export class DateAgoFormatTransformer implements Transformer {

    public doTransform(item: any): void {
        item.date_ago_format = DateHelper.getAgoFormat(item.date);
    }
}

export const dateAgoFormatTransformerIns = new DateAgoFormatTransformer();

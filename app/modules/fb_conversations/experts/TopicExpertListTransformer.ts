import { Transformer } from '@app/collections/Transformer';

export class TopicExpertListTransformer implements Transformer {

    public doTransform(item: any) {
        // tslint:disable-next-line: no-console
        console.log('EXPERT LIST::', item.data);
        let result = [];
        let find = false;
        const data = item.data;
        result = data.slice(0, 20).map((d: any, index: number) => {
            d.rank = index + 1;
            return d;
        });
        result.forEach((d) => {
            if (d.user_id === item.user_id) {
                find = true;
            }
        });
        if (!find) {
            const userData: any = data.filter((d: any) => d.user_id === item.user_id);
            if (userData.length > 0) {
                userData[0].rank = data.indexOf(userData[0]) + 1;
            }
            result = result.concat(userData);
        }
        return result;
    }
}

export const topicExpertListTransformer = new TopicExpertListTransformer();

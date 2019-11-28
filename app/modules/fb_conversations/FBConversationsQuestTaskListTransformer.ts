import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { url } from 'inspector';
import { DateHelper } from '../helper/DateHelper';

class FBConversationsQuestTaskListTransformer {

    private items: any;
    private changed: any;
    constructor(items: any) {
        this.items = items;
        this.changed = {};
    }

    public transform() {

        if (inputHelperIns.isInputValid(this.items)) {
            const firstItem = this.items[0];
            let rewardAmtformat: any = firstItem.reward_amount;
            const rewardamt = firstItem.reward_amount > 0 ? firstItem.reward_amount.toLocaleString() : '';
            rewardAmtformat = rewardAmtformat.toLocaleString();
            this.changed = { name: firstItem.name, end_date: DateHelper.convertDateStr(firstItem.end_date, 'Do MMM'), description: firstItem.description + ` ${rewardAmtformat}`, show_learn_more: 0, reward_amount: rewardamt, learn_more_description: firstItem.learn_more_description, tasks: [] };

            this.items.forEach((item) => {
                this.changed.tasks.push({ task_name: item.task_name, task_description: item.task_description, task_goal: item.goal, is_completed: item.is_completed, current_metric_count: item.current_metric_count });
                this.changed.show_learn_more += item.current_metric_count;
            });
            this.changed.show_learn_more = this.changed.show_learn_more === 0;
        }
        return this.changed;
    }
}

export const fbConversationsQuestTaskListTransformerIns = (items: any): FBConversationsQuestTaskListTransformer => {
    return new FBConversationsQuestTaskListTransformer(items);
};

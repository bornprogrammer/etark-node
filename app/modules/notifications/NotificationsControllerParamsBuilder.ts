import { PnsEventsName } from '@app/enums/PnsEventsName';
import { CtrlMethodParamsBuilder } from '@app/method-handler/CtrlMethodParamsBuilder';
import { Request } from 'express';

class NotificationsControllerParamsBuilder extends CtrlMethodParamsBuilder {

    constructor(req: Request) {
        super(req);
    }

    public setPnsEventNameFromBody = () => {
        // this.params.pns_event_name = this.request.body.;
        return this.setParamsFromReqBody('pns_event_name');
    }

    public setPnsEventNameFromUrl = () => {
        // this.params.pns_event_name = this.request.body.;
        return this.setParamsFromUrl('pns_event_name', 'pnsEventName');
    }
}
export const notificationsControllerParamsBuilderIns = (req: Request) => {
    return new NotificationsControllerParamsBuilder(req);
};

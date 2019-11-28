import { resourceHelperIns } from '@app/modules/helper/ResourceHelper';
import { UserSessionsRepository } from '@app/repositories';

// this can be moved to a new folder named middlewares
// but as of now this is the only custom middleware that we have hence keeping it in services
export default class AuthMiddleware {

    private userSessionsRepository: UserSessionsRepository;

    public constructor(userSessionsRepository: UserSessionsRepository) {
        this.userSessionsRepository = userSessionsRepository;
    }

    public required = async (req, res, next) => {
        if (req.query.token) {
            const userSession = await this.userSessionsRepository.findOneByToken(req.query.token);
            if (userSession) {
                req.user = { id: userSession.userId };
                next();
            } else {
                res.status(401).send({
                    success: false,
                    message: 'Invalid Auth Token',
                });
            }
        } else {
            res.status(401).send({
                success: false,
                message: 'Auth token not found',
            });
        }
    }

}

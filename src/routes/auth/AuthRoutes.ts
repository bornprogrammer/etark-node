import express, { Router } from 'express';
import { authControllerIns } from "./../../features/auth/AuthController";

export class AuthRoutes {

    public static setRoutes(): Router {

        let router: express.Router = express.Router();

        router.post("/login", authControllerIns.login);

        router.post("/", authControllerIns.createUser);

        return router;

    }


}
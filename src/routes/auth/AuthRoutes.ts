import { Router } from "express";
import { authControllerIns } from "./../../features/auth/AuthController";

export class AuthRoutes {

    public static setRoutes(router: Router): Router {

        router.post("/login", authControllerIns.login);

        return router;

    }


}
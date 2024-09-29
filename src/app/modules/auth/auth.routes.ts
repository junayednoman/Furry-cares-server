import { Router } from "express";
import { authControllers } from "./auth.controller";
import { UserLoginValidationSchema, UserValidationSchema } from "./auth.validation";
import { handleMiddleware } from "../../middlewares/handleMiddleware";


const router = Router()
router.post('/register',
    handleMiddleware(UserValidationSchema),
    authControllers.createUser)
router.post('/login',
    handleMiddleware(UserLoginValidationSchema),
    authControllers.loginUser)

export const authRoutes = router
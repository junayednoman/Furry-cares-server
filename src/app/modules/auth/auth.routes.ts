import { Router } from "express";
import { authControllers } from "./auth.controller";
import { UserValidationSchema } from "./auth.validation";
import { handleMiddleware } from "../../middlewares/handleMiddleware";


const router = Router()
router.post('/register',
    handleMiddleware(UserValidationSchema),
    authControllers.createUser)

export const authRoutes = router
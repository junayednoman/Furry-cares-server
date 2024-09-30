import { Router } from "express";
import { authControllers } from "./auth.controller";
import { ForgetPasswordValidationSchema, ResetPasswordValidationSchema, UserLoginValidationSchema, UserUpdateValidationSchema, UserValidationSchema } from "./auth.validation";
import { handleMiddleware } from "../../middlewares/handleMiddleware";


const router = Router()

router.post('/register',
    handleMiddleware(UserValidationSchema),
    authControllers.createUser)

router.post('/login',
    handleMiddleware(UserLoginValidationSchema),
    authControllers.loginUser)

router.post('/forget-password',
    handleMiddleware(ForgetPasswordValidationSchema),
    authControllers.forgetPassword)

router.post('/reset-password',
    handleMiddleware(ResetPasswordValidationSchema),
    authControllers.resetPassword)

router.get('/profile',
    authControllers.getOwnProfile)

router.put('/update-profile',
    handleMiddleware(UserUpdateValidationSchema),
    authControllers.updateProfile)

export const authRoutes = router
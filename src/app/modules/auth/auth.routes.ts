import { Router } from "express";
import { authControllers } from "./auth.controller";
import { ForgetPasswordValidationSchema, ResetPasswordValidationSchema, UserLoginValidationSchema, UserUpdateValidationSchema, UserValidationSchema } from "./auth.validation";
import authGuard from "../../middlewares/authGuard";
import { handleZodValidation } from "../../middlewares/handleZodValidation";


const router = Router()

router.post('/register',
    handleZodValidation(UserValidationSchema),
    authControllers.createUser)

router.post('/login',
    handleZodValidation(UserLoginValidationSchema),
    authControllers.loginUser)

router.post('/forget-password',
    handleZodValidation(ForgetPasswordValidationSchema),
    authControllers.forgetPassword)

router.post('/reset-password',
    handleZodValidation(ResetPasswordValidationSchema),
    authControllers.resetPassword)

router.get('/profile',
    authControllers.getOwnProfile)

router.put('/update-profile',
    authGuard(['admin', 'user']),
    handleZodValidation(UserUpdateValidationSchema),
    authControllers.updateProfile)

router.get('/get-access-token',
    authControllers.getNewAccessToken)

router.get('/',
    authGuard(['admin']),
    authControllers.getAllUsers)

export const authRouter = router
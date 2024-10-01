import { Router } from "express";
import { authControllers } from "./auth.controller";
import { ForgetPasswordValidationSchema, ResetPasswordValidationSchema, UserLoginValidationSchema, UserValidationSchema } from "./auth.validation";
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

router.get('/get-access-token',
    authControllers.getNewAccessToken)


export const authRouter = router
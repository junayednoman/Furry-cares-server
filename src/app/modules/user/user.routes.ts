import { Router } from "express"
import authGuard from "../../middlewares/authGuard"
import { userController } from "./user.controller"
import { handleZodValidation } from "../../middlewares/handleZodValidation"
import { UserUpdateValidationSchema } from "../auth/auth.validation"

const router = Router()
router.get('/',
  authGuard(['admin']),
  userController.getAllUsers)

router.get('/profile',
  userController.getOwnProfile)

router.put('/update-profile',
  authGuard(['admin', 'user']),
  handleZodValidation(UserUpdateValidationSchema),
  userController.updateProfile)

router.post('/follow', authGuard(['admin', 'user']), userController.followingUser)

router.post('/unfollow', authGuard(['admin', 'user']), userController.unFollowingUser)

export const userRouter = router
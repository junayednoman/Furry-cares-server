import { Router } from "express"
import authGuard from "../../middlewares/authGuard"
import { userController } from "./user.controller"
import { handleZodValidation } from "../../middlewares/handleZodValidation"
import { userIdValidationSchema, UserUpdateValidationSchema } from "../auth/auth.validation"
import { multerUpload } from "../../config/multer.config"
import validateImageFileRequest from "../../middlewares/validateImageFileRequest"
import { parseBody } from "../../middlewares/bodyParser"
import { ImageFileZodSchema } from "../post/post.validation"

const router = Router()
router.get('/',
  userController.getAllUsers)
router.get('/user/:userId',
  userController.getSingleUser)

router.get('/my-profile',
  userController.getOwnProfile)

router.put('/update-profile',
  authGuard(['admin', 'user']),
  multerUpload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]),
  validateImageFileRequest(ImageFileZodSchema),
  parseBody,
  handleZodValidation(UserUpdateValidationSchema),
  userController.updateProfile)

router.patch('/', authGuard(['admin']), handleZodValidation(userIdValidationSchema), userController.changeUserRole)

router.post('/follow', authGuard(['admin', 'user']), userController.followingUser)

router.post('/unfollow', authGuard(['admin', 'user']), userController.unFollowingUser)

router.delete('/:userDeleteId', authGuard(['admin']), userController.deleteUser)

export const userRouter = router
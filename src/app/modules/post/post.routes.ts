import { Router } from "express";
import { postControllers } from "./post.controller";
import authGuard from "../../middlewares/authGuard";
import { ImageFileUpdateZodSchema, ImageFileZodSchema, postUpdateValidationSchema, postValidationSchema, updatePostPublishStatus, voteValidationSchema } from "./post.validation";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";

const router = Router();
router.post('/',
  authGuard(['admin', 'user']),
  multerUpload.single('image'),
  validateImageFileRequest(ImageFileZodSchema),
  parseBody,
  handleZodValidation(postValidationSchema),
  postControllers.createPost)

router.get('/',
  authGuard(['admin', 'user']),
  postControllers.getAllPosts)

router.get('/:id',
  postControllers.getPostById)

router.put('/:id',
  authGuard(['admin', 'user']),
  multerUpload.single('image'),
  validateImageFileRequest(ImageFileUpdateZodSchema),
  parseBody,
  handleZodValidation(postUpdateValidationSchema),
  postControllers.updateSinglePost)

router.patch('/vote/:id',
  handleZodValidation(voteValidationSchema),
  postControllers.updatePostVote)

router.delete('/:id',
  authGuard(['admin', 'user']),
  postControllers.deletePost)

router.get('/user/:userId',
  authGuard(['admin', 'user']),
  postControllers.getPostByUser)

router.patch('/publish/:id',
  authGuard(['admin', 'user']),
  handleZodValidation(updatePostPublishStatus),
  postControllers.updatePostPublishStatus)


export const postRouter = router;
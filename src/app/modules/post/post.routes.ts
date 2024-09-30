import { Router } from "express";
import { postControllers } from "./post.controller";
import authGuard from "../../middlewares/authGuard";
import { ImageFileUpdateZodSchema, ImageFileZodSchema, postUpdateValidationSchema, postValidationSchema, voteValidationSchema } from "./post.validation";
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

export const postRouter = router;
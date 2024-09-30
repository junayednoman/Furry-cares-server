import { Router } from "express";
import { postControllers } from "./post.controller";
import authGuard from "../../middlewares/authGuard";
import { ImageFileZodSchema, postValidationSchema } from "./post.validation";
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

export const postRouter = router;
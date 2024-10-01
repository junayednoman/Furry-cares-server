import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import { commentControllers } from "./comment.controller";

const router = Router()

router.post('/', authGuard(['admin', 'user']), commentControllers.createComment)

export const commentRouter = router;
import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import { commentControllers } from "./comment.controller";

const router = Router()

router.post('/', authGuard(['admin', 'user']), commentControllers.createComment)
router.patch('/:id', authGuard(['admin', 'user']), commentControllers.updateComment)
router.delete('/:id', authGuard(['admin', 'user']), commentControllers.deleteComment)

export const commentRouter = router;
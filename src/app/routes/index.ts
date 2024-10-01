import { Router } from "express";
import { postRouter } from "../modules/post/post.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { commentRouter } from "../modules/comment/comment.routes";

const router = Router()
const apiRoutes = [
    { path: '/auth', route: authRouter },
    { path: '/posts', route: postRouter },
    { path: '/comments', route: commentRouter },
]

apiRoutes.forEach(route => (
    router.use(route.path, route.route)
))
export default router
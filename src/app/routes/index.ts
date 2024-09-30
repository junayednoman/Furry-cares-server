import { Router } from "express";
import { postRouter } from "../modules/post/post.routes";
import { authRouter } from "../modules/auth/auth.routes";

const router = Router()
const apiRoutes = [
    { path: '/auth', route: authRouter },
    { path: '/posts', route: postRouter }
]

apiRoutes.forEach(route => (
    router.use(route.path, route.route)
))
export default router
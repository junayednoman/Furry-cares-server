import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router()
const apiRoutes = [
    { path: '/auth', route: authRoutes }
]

apiRoutes.forEach(route => (
    router.use(route.path, route.route)
))
export default router
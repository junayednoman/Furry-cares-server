import { Response, Request } from "express"
import { authServices } from "./auth.service"
import { successResponse } from "../../utils/successResponse"
import handleAsyncRequest from "../../utils/handleAsyncRequest"



const createUser = handleAsyncRequest(async (req: Request, res: Response) => {
    const result = await authServices.createUserIntoDb(req.body)
    successResponse((res), { message: "User created successfully!", data: result })
})

export const authControllers = {
    createUser
}
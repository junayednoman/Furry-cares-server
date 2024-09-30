import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

export const handleZodValidation = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    await schema.parseAsync(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
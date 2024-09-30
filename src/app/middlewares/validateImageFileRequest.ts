/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodArray, ZodEffects, ZodRecord } from 'zod';
import handleAsyncRequest from '../utils/handleAsyncRequest';

const validateImageFileRequest = (
  schema: AnyZodObject | ZodEffects<any> | ZodArray<any> | ZodRecord<any>
) => {
  return handleAsyncRequest(async (req: Request, res: Response, next: NextFunction) => {
    const parsedFile = await schema.parseAsync({
      file: req.file,
    });

    req.file = parsedFile.file;

    next();
  });
};

export default validateImageFileRequest;

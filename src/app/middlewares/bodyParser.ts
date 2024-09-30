import { AppError } from "../error/appError";
import handleAsyncRequest from "../utils/handleAsyncRequest";

export const parseBody = handleAsyncRequest(async (req, res, next) => {
  if (!req?.body?.data) {
    throw new AppError(400, 'Please provide data in the body under data key');
  }
  req.body = JSON.parse(req?.body?.data);

  next();
});

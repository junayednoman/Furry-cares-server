export type TBodyReqFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}
export type TBodyReqFiles = Record<string, TBodyReqFile[]>
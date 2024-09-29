export type TErrorSources = {
    path: string | number
    message: string
}[]

export type TErrorResponse = {
    success: string;
    message: string;
    errorSource: TErrorSources;
    stack: string;
}
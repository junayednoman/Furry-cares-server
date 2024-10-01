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

export type TJwtPayload = {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    iat: number;
    exp: number;
}
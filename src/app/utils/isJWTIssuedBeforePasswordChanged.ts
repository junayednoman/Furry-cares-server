const isJWTIssuedBeforePasswordChanged = (passwordChangedAt: Date, iat: number) => {
  const passwordChangedAtDate = new Date(passwordChangedAt).getTime() / 1000
  return passwordChangedAtDate > iat
}

export default isJWTIssuedBeforePasswordChanged
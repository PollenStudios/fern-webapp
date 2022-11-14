export const VERIFY_TOKEN_QUERY = `
query Query($request: Jwt!) {
  verify(request: {
    accessToken: $request
  })
}
`;

export const REFRESH_AUTHENTICATION_MUTATION = `
    mutation Refresh($request: RefreshRequest!) {
      refresh(request: $request) {
        accessToken
        refreshToken
      }
    }
  `;

import { beforeUserSignedIn } from 'firebase-functions/v2/identity'

export const setAuthRole = beforeUserSignedIn((event) => {
  return {
    customClaims: {
      role: 'authenticated',
    },
  }
})
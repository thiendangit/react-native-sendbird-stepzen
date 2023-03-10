import React, { createContext, ReactElement, useContext, useLayoutEffect, useRef } from 'react'

import { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth'

export const FirebaseContext = createContext<{
  currentUser?: () => FirebaseAuthTypes.User | null | undefined
  loginFB?: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential> | undefined
  logoutFB?: () => Promise<any> | undefined
  updatePasswordFB?: (newPassword: string) => Promise<any> | undefined
  registerFB?: (
    displayName: string,
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | undefined>
}>({})

function useFirebaseValue() {
  const authRef = useRef<FirebaseAuthTypes.Module | undefined>(undefined)

  useLayoutEffect(() => {
    authRef.current = firebase.auth()
  }, [])
  function loginFB(email: string, password: string) {
    return authRef.current?.signInWithEmailAndPassword(email, password)
  }

  function logoutFB() {
    return authRef.current?.signOut()
  }

  function currentUser() {
    return authRef.current?.currentUser
  }

  function updatePasswordFB(newPassword: string) {
    const user = authRef.current?.currentUser
    // var newPassword = getASecureRandomPassword()

    return user
      ?.updatePassword(newPassword)
      .then(function () {
        // Update successful.
      })
      .catch(function () {
        // An error happened.
      })
  }

  async function registerFB(displayName: string, email: string, password: string) {
    const result = await authRef.current?.createUserWithEmailAndPassword(email, password)
    console.log(result)

    if (result) {
      authRef.current?.currentUser?.updateProfile({
        displayName,
      })

      const { user } = result

      console.log(`Sign-in provider: ${user?.providerId}`)
      console.log(`Provider-specific UID: ${user?.uid}`)
      console.log(`Name: ${user?.displayName}`)
      console.log(`Email: ${user?.email}`)
      console.log(`Photo URL: ${user?.photoURL}`)
    }

    return result
  }

  return {
    currentUser,
    loginFB,
    logoutFB,
    updatePasswordFB,
    registerFB,
  }
}

export const FirebaseProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={useFirebaseValue()}>{children}</FirebaseContext.Provider>
  ) as ReactElement
}

export const useFirebase = () => useContext(FirebaseContext)

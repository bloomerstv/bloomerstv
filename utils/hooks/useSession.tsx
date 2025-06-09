import { useAuth, AuthContextType } from '../../components/wrappers/AuthContext'

/**
 * Custom hook that provides authentication session data from the global context.
 * This is now a thin wrapper around useAuth for backward compatibility.
 * @returns {AuthContextType} Authentication session data
 */
const useSession = (): AuthContextType => {
  return useAuth()
}

export default useSession

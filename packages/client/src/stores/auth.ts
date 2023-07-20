import type { AtpSessionData as SessionData } from '@atproto/api'
import { BskyAgent } from '@atproto/api'

const SERVICE_LOCAL_STORAGE_KEY = 'service'
const SESSION_LOCAL_STORAGE_KEY = 'session'

export const useAuthStore = defineStore('auth', () => {
  const service = ref<string | undefined>(
    getLocalStorage(SERVICE_LOCAL_STORAGE_KEY) ?? undefined,
  )

  const session = ref<SessionData | null | undefined>(
    JSON.parse(getLocalStorage(SESSION_LOCAL_STORAGE_KEY) || 'null'),
  )

  const agent = ref<BskyAgent | undefined>(
    service.value ? new BskyAgent({ service: service.value }) : undefined,
  )

  const isResuming = ref(false)

  const isInitialized = ref(false)

  const login = async (service: string, identifier: string, password: string) => {
    const newAgent = new BskyAgent({ service })

    const { success, data } = await newAgent.login({ identifier, password })

    if (success && data) {
      setLocalStorage(SERVICE_LOCAL_STORAGE_KEY, service)
      setLocalStorage(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(data))
      session.value = data
      agent.value = newAgent
    }
    else {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    removeItemLocalStorage(SERVICE_LOCAL_STORAGE_KEY)
    removeItemLocalStorage(SESSION_LOCAL_STORAGE_KEY)
    session.value = undefined
    agent.value = undefined
  }

  const setSession = (newSession: SessionData) => {
    setLocalStorage(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(newSession))
    session.value = newSession
  }

  return {
    service,
    session,
    agent,
    isResuming,
    isInitialized,
    login,
    logout,
    setSession,
  }
})

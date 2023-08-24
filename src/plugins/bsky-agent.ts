import * as api from '@atproto/api'
import { useSessionStore } from '~/stores/session'

export default defineNuxtPlugin({
  name: 'bsky-agent',
  async setup() {
    const sessionStore = useSessionStore()

    const agent = new api.BskyAgent({
      service: 'https://bsky.social',
      persistSession: (_evt, sess) => {
        sessionStore.setSession(sess)
      },
    })

    return {
      provide: {
        bskyAgent: agent,
      },
    }
  },
})

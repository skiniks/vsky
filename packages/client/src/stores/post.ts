import type { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'

interface FeedResponse {
  post: {
    uri: string
    cid: string
    author: {
      handle: string
      did: string
      profile?: any
      displayName?: string
      avatar?: string
    }
    record: any
    indexedAt: string
  }
  reply?: any
  reason?: any
  [k: string]: any
}

interface PostsState {
  posts: FeedResponse[]
  isLoading: boolean
  cursor?: string
}

let hasFetchedPosts = false

export const usePostsStore = defineStore({
  id: 'posts',
  state: (): PostsState => ({
    posts: [],
    isLoading: false,
    cursor: undefined,
  }),
  actions: {
    setPosts(posts: FeedResponse[]) {
      this.posts = posts
    },

    async fetchPosts() {
      const authStore = useAuthStore()
      if (!authStore.session || !authStore.agent) {
        console.error('No valid access token found or agent is undefined.')
        return
      }

      this.isLoading = true

      try {
        const headers = {
          Authorization: `Bearer ${authStore.session.accessJwt}`,
        }
        const response = await authStore.agent.getTimeline(
          {
            algorithm: 'reverse-chronological',
            limit: 20,
            cursor: this.cursor,
          },
          { headers },
        )

        const feed = response.data.feed.map((post: FeedViewPost) => ({
          ...post,
          post: {
            ...post.post,
            author: {
              handle: post.post.author.handle,
              did: post.post.author.did,
              avatar: post.post.author.avatar,
              displayName: post.post.author.displayName,
            },
            createdAt: post.post.indexedAt,
            record: { ...post.post.record },
          },
        }))

        this.addPosts(feed)
        // eslint-disable-next-line no-console
        console.log('Fetched posts:', feed)

        if (response.data.cursor)
          this.cursor = response.data.cursor
      }
      catch (error) {
        console.error('Error fetching posts:', error)
        throw error
      }
      finally {
        this.isLoading = false
      }
    },

    addPost(post: FeedResponse) {
      this.posts.unshift(post)
    },

    addPosts(newPosts: FeedResponse[]) {
      this.posts.push(...newPosts)
    },

    removePost(postId: string): boolean {
      const index = this.posts.findIndex(post => post.post.cid === postId)
      if (index !== -1) {
        this.posts.splice(index, 1)
        return true
      }
      return false
    },

    refreshPosts() {
      const authStore = useAuthStore()

      watch(
        [() => authStore.agent, () => authStore.session],
        ([newAgent, newSession]) => {
          if (newAgent && newSession && !hasFetchedPosts) {
            this.fetchPosts()
            hasFetchedPosts = true
          }
        },
        { immediate: true },
      )
    },
  },
})

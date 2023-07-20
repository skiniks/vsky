<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'
import type { ThreadViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs'

const props = defineProps({
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
})

const router = useRouter()
const slug = ref<string | null>(null)
const postCID = ref<string | null>(null)
const isLoading = ref(true)
const thread = ref<ThreadViewPost | null>(null)

onMounted(async () => {
  slug.value = router.currentRoute.value.params.slug as string
  postCID.value = router.currentRoute.value.params.cid as string
  await fetchData(slug.value, postCID.value)
})

onBeforeRouteUpdate(async (to, _from, next) => {
  slug.value = to.params.slug as string
  postCID.value = to.params.cid as string
  await fetchData(slug.value, postCID.value)
  next()
})

async function fetchData(slug: string | null, cid: string | null) {
  isLoading.value = true

  try {
    if (props.agent && slug && cid) {
      const sessionData = localStorage.getItem('session') || '{}'
      await props.agent.resumeSession(JSON.parse(sessionData))

      let response
      if (slug.startsWith('did')) {
        response = await props.agent.getPostThread({ uri: `at://${slug}/app.bsky.feed.post/${cid}` })
      }
      else {
        const didData = await props.agent.resolveHandle({ handle: slug })
        response = await props.agent.getPostThread({ uri: `at://${didData.data.did}/app.bsky.feed.post/${cid}` })
        // eslint-disable-next-line no-console
        console.log(response)
      }

      if (response.success)
        thread.value = response.data.thread as ThreadViewPost
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="thread" class="max-w-xl m-auto">
    <Loading v-if="isLoading" />
    <div v-else class="post mt-6 mb-6">
      <Post v-if="thread?.parent && agent" :post="thread.parent" :agent="agent" class="parent-post mb-6" />
      <Post v-if="agent" :post="thread.post" :agent="agent" />
      <div v-if="thread.replies?.length && agent" class="replies mb-20">
        <NestedReply v-for="(reply, index) in thread.replies" :key="index" :reply="reply" :agent="agent" />
      </div>
    </div>
  </div>
</template>

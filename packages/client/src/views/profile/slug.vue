<script setup lang="ts">
import { type BskyAgent, RichText } from '@atproto/api'
import type { ProfileViewDetailed } from '@atproto/api/src/client/types/app/bsky/actor/defs'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  agent: Object as () => BskyAgent | null,
})

const router = useRouter()
const slug = ref<string | null>(null)
const isLoading = ref(true)
const profile = ref<ProfileViewDetailed | null>(null)
const posts = ref<Array<any>>([])

onMounted(async () => {
  slug.value = router.currentRoute.value.params.slug as string
  fetchData(slug.value)
})

onBeforeRouteUpdate(async (to, _from, next) => {
  slug.value = to.params.slug as string
  await fetchData(slug.value)
  next()
})

async function fetchData(handle: string | null) {
  isLoading.value = true

  try {
    await fetchProfile(handle)
    await fetchPosts(handle)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}

async function fetchProfile(handle: string | null) {
  let response
  if (props.agent && handle) {
    const sessionData = localStorage.getItem('session') || '{}'
    await props.agent.resumeSession(JSON.parse(sessionData))
    response = await props.agent.getProfile({ actor: handle })

    // eslint-disable-next-line no-console
    console.log('Response:', response)

    if (response?.data) {
      profile.value = response.data
      if (profile.value.description)
        profile.value.description = await formatDescription(profile.value.description)
    }
  }
}

async function formatDescription(description: string) {
  if (props.agent) {
    const rt = new RichText({ text: description })
    await rt.detectFacets(props.agent)

    let markdown = ''
    for (const segment of rt.segments()) {
      if (segment.isLink()) {
        const displayText = truncate(segment.text, 40)
        markdown += `[${displayText}](${segment.link?.uri})`
      }
      else if (segment.isMention()) {
        markdown += `[${segment.text}](https://vsky-final.vercel.app/profile/${segment.mention?.did})`
      }
      else {
        markdown += segment.text
      }
    }

    const md = new MarkdownIt()
    return md.render(markdown)
  }
  return description
}

async function fetchPosts(handle: string | null) {
  if (props.agent && handle) {
    const response = await props.agent.getAuthorFeed({
      actor: handle,
      limit: 20,
    })

    // eslint-disable-next-line no-console
    console.log('Posts:', response)

    posts.value = response?.data.feed.filter(post => !post.reply) || []
  }
}
</script>

<template>
  <div class="max-w-xl m-auto">
    <Loading v-if="isLoading" />
    <div v-else>
      <div v-if="profile">
        <div v-if="profile.banner">
          <img :src="profile.banner" :alt="profile.displayName" class="w-full">
        </div>
        <div v-else class="w-full h-48 bg-blue-300" />
        <div class="flex">
          <div>
            <div v-if="profile.avatar">
              <img :src="profile.avatar" :alt="profile.displayName" class="-mt-18 w-32 h-32 rounded-full ring ring-blue-600 ring-offset-black ring-offset-4 ring-width-4">
            </div>
            <div v-else class="-mt-18 w-32 h-32 rounded-full bg-blue-600" />
          </div>
          <div class="-mt-18 font-mono bg-white w-full text-black p-6 rounded-xl shadow-md ml-4">
            <div class="text-xl font-normal mb-1">
              {{ profile.displayName }}
            </div>
            <div class="text-md font-normal">
              <span class="text-blue-600">@</span>{{ profile.handle }}
            </div>
            <div class="text-md font-normal mt-4 break-words" v-html="profile.description" />
          </div>
        </div>
        <div v-if="posts.length > 0">
          <div v-for="post in posts" :key="post.post.cid" class="post mt-6 mb-6">
            <Post v-if="agent && !post.post.record.reply" :post="post" :agent="agent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

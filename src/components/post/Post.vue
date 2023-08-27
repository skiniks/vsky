<script setup lang="ts">
import { getElapsedTime } from '~/utils/elapsed-time'

const props = defineProps({
  post: Object,
  agent: Object,
})

const nuxtApp = useNuxtApp()
const bskyAgent = nuxtApp.$bskyAgent
const currentPost = computed(() => props.post?.post)
const postTimestamp = computed(() => getElapsedTime(currentPost.value.record.createdAt))

const likeUri = ref(props.post?.post?.viewer?.like)
const repostUri = ref(props.post?.post?.viewer?.repost)

function handleLikeToggled(newLikeUri: string | null) {
  likeUri.value = newLikeUri
}

function handleRepostToggled(newRepostUri: string | null) {
  repostUri.value = newRepostUri
}
</script>

<template>
  <li class="list-none bg-white text-black rounded-3xl shadow-lg p-6 mb-4">
    <PostHeader :author="currentPost?.author" :timestamp="postTimestamp" :post="post" />
    <PostText :text="currentPost?.record?.text" :agent="bskyAgent" />

    <!-- sharing a feed -->
    <div v-if="post?.post?.embed?.record" class="flex mt-4 mb-4">
      <img v-if="post?.post?.embed?.record?.avatar" :src="post?.post?.embed?.record?.avatar" class="h-12 w-12">
      <div class="flex-col ml-2 font-mono">
        <div>
          {{ post?.post?.embed?.record?.displayName }}
        </div>
        <div v-if="post?.post?.embed?.record?.creator?.handle">
          by {{ post?.post?.embed?.record?.creator?.handle }}
        </div>
      </div>
    </div>

    <PostEmbed :images="currentPost?.embed?.images" />
    <PostEmbedExternal :external="currentPost?.embed?.external" />
    <PostEmbedMedia :images="currentPost?.embed?.media?.images" />
    <PostEmbedRecord :record="currentPost?.embed?.record" />
    <PostEmbedRecordNested :record="currentPost?.embed?.record?.record" />
    <PostReason :reason="post?.reason" />
    <PostActions
      :post="currentPost"
      :post-cid="currentPost?.cid"
      :post-uri="currentPost?.uri"
      :like-uri="likeUri"
      :repost-uri="repostUri"
      :agent="bskyAgent"
      @likeToggled="handleLikeToggled"
      @repostToggled="handleRepostToggled"
    />
  </li>
</template>

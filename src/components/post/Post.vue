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
</script>

<template>
  <li class="bg-white text-black rounded-3xl shadow-lg p-6 mb-4">
    <PostHeader :author="currentPost?.author" :timestamp="postTimestamp" :post="post" />
    <PostText :text="currentPost?.record?.text" :agent="bskyAgent" />
    <PostEmbed :images="currentPost?.embed?.images" />
    <PostEmbedExternal :external="currentPost?.embed?.external" />
    <PostEmbedMedia :images="currentPost?.embed?.media?.images" />
    <PostEmbedRecord :record="currentPost?.embed?.record" />
    <PostEmbedRecordNested :record="currentPost?.embed?.record?.record" />
    <PostReason :reason="post?.reason" />
  </li>
</template>

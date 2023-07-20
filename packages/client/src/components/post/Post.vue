<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
})

const { post, agent } = props

const postData = computed(() => {
  if ('post' in post)
    return post.post
  else
    return post
})

const author = computed(() => postData.value.author)
const text = computed(() => postData.value.record.text)
const createdAt = computed(() => postData.value.record.createdAt)
const uri = computed(() => postData.value.uri)
const cid = computed(() => postData.value.cid)
const reason = computed(() => post.reason)

const images = computed(() => postData.value.embed?.images)
const external = computed(() => postData.value.embed?.external)
const record = computed(() => postData.value.embed?.record)
const media = computed(() => postData.value.record?.embed?.media)
const postImages = computed(() => postData.value.embed?.media?.images)
const postRecordImages = computed(() => postData.value.embed?.record?.record?.embeds[0]?.media?.images)
</script>

<template>
  <PostWrapper>
    <router-link :to="`/profile/${author.handle}/post/${uri.split('/').pop()}`" class="no-underline text-black hover:text-black">
      <PostHeader :author="author" :created-at="createdAt" />
      <PostContent :text="text" :agent="agent" />
      <PostEmbed v-if="images" :images="images" :class="{ 'mt-6': !text }" />
      <PostEmbedExternal v-if="external" :external="external" />
      <PostEmbedRecord v-if="record" :record="record" :agent="agent" />
      <PostEmbedRecordWithMedia
        v-if="media" :record="record" :post-images="postImages"
        :post-record-images="postRecordImages"
      />
      <div class="flex justify-between items-center">
        <RepostChip v-if="reason" :reason="reason" />
      </div>
    </router-link>
    <PostActions
      :post-uri="uri"
      :post-cid="cid"
      :agent="agent"
      :handle="author.handle"
      :post="post"
      :class="reason ? '' : 'ml-auto'"
    />
  </PostWrapper>
</template>

<script setup lang="ts">
defineProps({
  post: Object,
  agent: Object,
})
</script>

<template>
  <li v-if="post" class="bg-white text-black rounded-3xl shadow-lg p-6 mb-4">
    <PostHeader :author="post.post.author" :timestamp="getElapsedTime(post.post.record.createdAt)" :post="post" />
    <PostText :text="post.post.record.text" :reply="post.post.record.reply" :agent="agent" />
    <PostEmbed :images="post.post.embed?.images" />
    <PostEmbedExternal :external="post.post.embed?.external" />
    <PostEmbedRecord :record="post.post.embed?.record" />
    <PostEmbedMedia :images="post.post.embed?.media?.images" />
    <PostRecordEmbedDetail :record="post.post.embed?.record?.record" />
    <PostReason :reason="post.reason" />
  </li>
</template>

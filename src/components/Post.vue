<script setup lang="ts">
defineProps({
  post: Object,
})
</script>

<template>
  <li v-if="post" class="bg-white text-black rounded-3xl shadow-lg p-6 mb-4">
    <AuthorDetail :author="post.post.author" :timestamp="getElapsedTime(post.post.record.createdAt)" :post="post" />
    <PostText :text="post.post.record.text" :reply="post.post.record.reply" />
    <PostImages :images="post.post.embed?.images" />
    <EmbedExternal :external="post.post.embed?.external" />
    <EmbedRecord :record="post.post.embed?.record" />
    <RepostWithMedia :images="post.post.embed?.media?.images" />
    <QuotePost :record="post.post.embed?.record?.record" />
    <RepostInfo :reason="post.reason" />
  </li>
</template>

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
    <PostEmbedRecordWithMedia :images="post.post.embed?.media?.images" />
    <PostRecordEmbedDetail :record="post.post.embed?.record?.record" />

    <div v-if="post.reason" class="mt-4">
      <div class="text-gray-400 mb-2 font-mono text-sm">
        Reposted by
      </div>
      <div class="flex items-center">
        <div>
          <img :src="post.reason.by.avatar" class="w-10 h-10 rounded-full">
        </div>
        <div class="flex flex-col ml-2">
          <div class="font-mono text-sm">
            {{ post.reason.by.displayName }}
          </div>
          <div class="text-gray-400 text-xs font-mono">
            {{ post.reason.by.handle }}
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

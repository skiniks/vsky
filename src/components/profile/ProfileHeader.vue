<script setup lang="ts">
const { profile } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div>
    <div v-if="profile.banner">
      <img :src="profile.banner" :alt="profile.displayName" class="w-full">
    </div>
    <div v-else class="w-full h-48 bg-blue-300" />
    <div class="flex">
      <div>
        <div v-if="profile.avatar">
          <img :src="profile.avatar" :alt="profile.displayName" class="-mt-12 rounded-full h-26 w-34">
        </div>
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
  </div>
</template>

<script setup lang="ts">
import type { External } from '@atproto/api/dist/client/types/app/bsky/embed/external'
import { truncate } from '../../utils/truncate'

const props = defineProps({
  external: {
    type: Object as () => External,
    required: false,
  },
})

const { external } = props

function isYoutubeLink(link: string) {
  return (
    (link.includes('youtube.com') || link.includes('youtu.be'))
    && !link.includes('youtube.com/@')
    && !link.includes('youtube.com/shorts')
    && !link.includes('youtube.com/playlist')
  )
}

function getYoutubeEmbedLink(link: string) {
  const url = new URL(link)
  let videoId
  if (link.includes('youtube.com/watch'))
    videoId = url.searchParams.get('v')
  else if (link.includes('youtu.be'))
    videoId = url.pathname.slice(1)

  if (videoId)
    return `https://www.youtube.com/embed/${videoId}`

  return ''
}

function isSpotifyLink(link: string) {
  return link.includes('open.spotify.com')
}

function getSpotifyEmbedLink(link: string) {
  return link.replace('open.spotify.com', 'open.spotify.com/embed')
}
</script>

<template>
  <div
    v-if="external && external.title !== ''"
    class="rounded-xl mb-6"
    :class="{
      'bg-dark': !(external.uri && isSpotifyLink(external.uri)),
      'shadow-lg': !(external.uri && isSpotifyLink(external.uri)),
      'p-6': !(external.uri && (isYoutubeLink(external.uri) || isSpotifyLink(external.uri))),
    }"
  >
    <a
      v-if="external?.uri && !isYoutubeLink(external.uri) && !isSpotifyLink(external.uri)"
      :href="external.uri"
      target="_blank" class="no-underline"
    >
      <img
        v-if="external?.thumb"
        :src="external?.thumb?.toString()"
        :alt="external?.title"
        class="w-full h-48 object-cover rounded-xl mb-4"
      >

      <h3 class="font-mono mt-0 mb-2 text-white">{{ truncate(external?.title, 140) }}</h3>
      <p class="font-mono dark:text-white opacity-85 text-xs mt-0 mb-2 underline overflow-auto break-words overflow-ellipsis">
        {{ truncate(external?.uri, 40) }}
      </p>
      <p class="font-mono text-white text-xs mt-0">{{ truncate(external?.description, 140) }}</p>
    </a>
    <div
      v-else-if="external?.uri && isYoutubeLink(external.uri)"
      class="video-container"
    >
      <iframe
        :src="getYoutubeEmbedLink(external.uri)"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <h3 class="font-mono mt-0 mb-2 text-white">
        {{ truncate(external?.title, 140) }}
      </h3>
      <p class="font-mono text-white text-xs mt-0">
        {{ truncate(external?.description, 140) }}
      </p>
    </div>
    <div
      v-else-if="external?.uri && isSpotifyLink(external.uri)"
      class="spotify-container"
    >
      <iframe
        :src="getSpotifyEmbedLink(external.uri)"
        title="Spotify music player"
        frameborder="0"
        allow="encrypted-media"
      />
      <h3 class="font-mono mt-0 mb-2 text-white">
        {{ truncate(external?.title, 140) }}
      </h3>
      <p class="font-mono text-white text-xs mt-0">
        {{ truncate(external?.description, 140) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
}

.spotify-container {
  position: relative;
  width: 100%;
  height: 152px;
  overflow: hidden;
}

.video-container iframe, .spotify-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

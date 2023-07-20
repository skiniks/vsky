<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'
import { RichText } from '@atproto/api'
import MarkdownIt from 'markdown-it'

interface Embed {
  images: {
    [index: number]: {
      thumb: string
      alt: string
    }
  }
}

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
})

const { record, agent } = props

const htmlText = ref('')

const filteredEmbeds = computed(() => {
  return record.embeds?.filter(
    (embed: Embed) => embed.images && embed.images[0] && embed.images[0].thumb,
  ) || []
})

onMounted(async () => {
  if (agent) {
    const rt = new RichText({ text: record?.value?.text })
    await rt.detectFacets(agent)

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
    htmlText.value = md.render(markdown)
  }
})
</script>

<template>
  <div v-if="record?.author" class="mb-4 border-solid border border-black rounded-xl p-4">
    <div class="flex items-center">
      <div v-if="record.author.avatar">
        <img :src="record?.author.avatar" :alt="`${record?.author.handle}'s Avatar`" class="w-10 h-10 rounded-full mr-2">
      </div>
      <div v-else class="w-10 h-10 bg-blue-600 rounded-full mr-2" />
      <div class="flex flex-col">
        <div class="font-mono text-sm">
          {{ record?.author.displayName }}
        </div>
        <div class="font-mono text-xs">
          <span class="text-blue-600">@</span>{{ record?.author.handle }}
        </div>
      </div>
    </div>
    <div class="font-mono text-sm overflow-auto" style="word-break: break-word;" v-html="htmlText" />
    <div v-if="filteredEmbeds.length" class="flex justify-center">
      <img
        v-for="(embed, index) in filteredEmbeds"
        :key="index"
        :src="embed.images[0].thumb"
        :alt="embed.images[0].alt"
        class="w-full h-100 object-cover rounded-xl"
      >
    </div>
  </div>
</template>

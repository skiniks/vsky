<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'
import { RichText } from '@atproto/api'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
})

const { text, agent } = props

const htmlText = ref('')

onMounted(async () => {
  const rt = new RichText({ text })
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
})
</script>

<template>
  <div v-if="htmlText" class="font-mono text-lg overflow-auto break-words overflow-ellipsis" v-html="htmlText" />
</template>

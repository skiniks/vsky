import { RichText } from '@atproto/api'
import MarkdownIt from 'markdown-it'
import { truncate } from '~/utils/truncate'

export function useRichText(text: string, agent?: any) {
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
        // Check if the mention has a valid did (or whatever condition you want to use for validity)
        if (segment.mention?.did) {
          markdown += `[${segment.text}](https://bsky.app/profile/${segment.mention?.did})`
        }
        else {
          // If not valid, just append the mention text without a link
          markdown += segment.text
        }
      }
      else {
        markdown += segment.text
      }
    }

    const md = new MarkdownIt()
    htmlText.value = md.render(markdown)
  })

  return {
    htmlText,
  }
}

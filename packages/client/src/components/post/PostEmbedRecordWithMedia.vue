<script setup lang="ts">
const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  postImages: {
    type: Array as () => Array<{ thumb: string; alt: string }>,
    required: true,
  },
  postRecordImages: {
    type: Array as () => Array<{ thumb: string; alt: string }>,
    default: () => [],
  },
})

const { record, postImages, postRecordImages } = props

const recordAuthor = computed(() => record?.record?.author || [])
const recordImages = computed(() => record.record.embeds[0]?.images || [])

function getGridSettings(images: string | any[]) {
  const imageCount = images?.length || 0
  const gridColumns = Math.ceil(Math.sqrt(imageCount))
  return { images, imageCount, gridColumns }
}

const postImageGrid = computed(() => getGridSettings(postImages))
const postRecordImageGrid = computed(() => getGridSettings(postRecordImages))
const recordImageGrid = computed(() => getGridSettings(recordImages.value))
</script>

<template>
  <div
    v-if="postImageGrid.images?.length"
    :class="`grid gap-4 ${postImageGrid.imageCount === 3 ? 'grid-cols-2' : `grid-cols-${postImageGrid.gridColumns}`}`"
  >
    <div
      v-for="(image, index) in postImageGrid.images" :key="image.thumb"
      :class="{ 'h-60 col-span-2': postImageGrid.imageCount === 3 && index === 2, 'h-60': postImageGrid.imageCount !== 3, 'h-full': postImageGrid.imageCount === 1 }"
      class="w-full"
    >
      <img :src="image.thumb" :alt="image.alt" class="w-full h-full rounded-xl shadow-md object-cover">
    </div>
  </div>
  <div class="border-solid border border-black rounded-xl p-4 mt-6 mb-4">
    <div class="flex items-center">
      <img :src="recordAuthor?.avatar" :alt="`${recordAuthor?.handle}'s Avatar`" class="w-10 h-10 rounded-full mr-2">
      <div class="flex flex-col">
        <div class="font-mono text-sm">
          {{ recordAuthor?.displayName }}
        </div>
        <div class="font-mono text-xs">
          <span class="text-blue-600">@</span>{{ recordAuthor?.handle }}
        </div>
      </div>
    </div>

    <div class="font-mono text-sm mt-4 mb-6 overflow-auto break-words overflow-ellipsis">
      {{ record?.record?.value.text }}
    </div>

    <div
      v-if="postRecordImageGrid.images?.length"
      :class="`grid gap-4 ${postRecordImageGrid.imageCount === 3 ? 'grid-cols-2' : `grid-cols-${postRecordImageGrid.gridColumns}`}`"
    >
      <div
        v-for="(image, index) in postRecordImageGrid.images" :key="image.thumb"
        :class="{ 'h-60 col-span-2': postRecordImageGrid.imageCount === 3 && index === 2, 'h-60': postRecordImageGrid.imageCount !== 3, 'h-full': postRecordImageGrid.imageCount === 1 }"
        class="w-full"
      >
        <img :src="image.thumb" :alt="image.alt" class="w-full h-full rounded-xl shadow-md object-cover">
      </div>
    </div>

    <div
      v-if="recordImageGrid.images?.length"
      :class="`grid gap-4 ${recordImageGrid.imageCount === 3 ? 'grid-cols-2' : `grid-cols-${recordImageGrid.gridColumns}`}`"
    >
      <div
        v-for="(image, index) in recordImageGrid.images" :key="image.thumb"
        :class="{ 'h-60 col-span-2': recordImageGrid.imageCount === 3 && index === 2, 'h-60': recordImageGrid.imageCount !== 3, 'h-full': recordImageGrid.imageCount === 1 }"
        class="w-full"
      >
        <img :src="image.thumb" :alt="image.alt" class="w-full h-full rounded-xl shadow-md object-cover">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const postsStore = usePostsStore()
const showNav = ref(true)
let lastScrollPosition = 0

const sessionData = JSON.parse(localStorage.getItem('session') || '{}')
const userHandle = sessionData.handle || ''

function checkScrollDirection() {
  if (postsStore.isLoading)
    return

  const currentScrollPosition = window.scrollY
  showNav.value = currentScrollPosition < lastScrollPosition
  lastScrollPosition = currentScrollPosition
}

onMounted(() => {
  window.addEventListener('scroll', checkScrollDirection)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollDirection)
})
</script>

<template>
  <div class="btm-nav bg-dark pb-4 md:pb-0" :class="{ hidden: !showNav }">
    <RouterLink to="/" aria-label="Home">
      <div class="i-carbon-home text-gray-300 text-3xl" />
    </RouterLink>
    <!-- <RouterLink to="/notifications" aria-label="Notifications">
      <div class="i-carbon-notification text-gray-300 text-3xl" />
    </RouterLink> -->
    <RouterLink :to="`/profile/${userHandle}`" aria-label="Profile">
      <div class="i-carbon-user text-gray-300 text-3xl" />
    </RouterLink>
  </div>
</template>

<style scoped>
.btm-nav {
  transition: transform 0.3s ease;
}

.btm-nav.hidden {
  transform: translateY(100%);
}
</style>

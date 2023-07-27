<script setup>
function deleteSessionData() {
  localStorage.removeItem('sessionData')
  window.location.reload()
}
</script>

<template>
  <div class="fixed bottom-4 right-4 cursor-pointer" @click="deleteSessionData">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path fill="#888888" d="M6 30h12a2.002 2.002 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2.002 2.002 0 0 0-2-2H6a2.002 2.002 0 0 0-2 2v24a2.002 2.002 0 0 0 2 2Z" />
      <path fill="#888888" d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6l-1.414-1.414z" />
    </svg>
  </div>
</template>

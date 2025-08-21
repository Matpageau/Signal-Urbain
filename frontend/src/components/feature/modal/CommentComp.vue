<script setup lang="ts">
import type { CommentData } from '@/types/Comment';
import userPlaceholder from '@/assets/img/Avatar placeholder.png'

const props = defineProps<{
  comment: CommentData
}>()


</script>

<template>
  <div class="flex flex-col">
    <div class="flex">
      <img 
        :src="props.comment.avatar_url || userPlaceholder"
        alt="avatar"
        @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
      >
      <h2>{{ props.comment.username }}</h2>
    </div>
    <p>{{ props.comment.content }}</p>
  </div>
</template>
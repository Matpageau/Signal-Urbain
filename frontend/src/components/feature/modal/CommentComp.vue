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
        :src="props.comment?.author_id.avatar_url || userPlaceholder"
        alt="avatar"
        class="w-[25px] h-[25px] rounded-full"
        @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
      >
      <h2 class="ml-1 font-bold">{{ props.comment.author_id.username }}</h2>
    </div>
    <p class="text-xs">{{ props.comment.content }}</p>
  </div>
</template>
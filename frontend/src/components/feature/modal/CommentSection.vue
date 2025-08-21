<script setup lang="ts">
import { ref } from 'vue';
import userPlaceholder from '@/assets/img/Avatar placeholder.png'
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import type { CommentData } from '@/types/Comment';
import { useReportStore } from '@/stores/reportStore';
import type { ReportData } from '@/types/Report';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import CommentComp from './CommentComp.vue';

const userStore = useUserStore()
const reportStore = useReportStore()

const props = defineProps<{
  report: ReportData
  commentList: CommentData[]
}>()

const emit = defineEmits<{
  (e: 'create', commentList: CommentData[]): void
}>()

const commentCount = ref<number>(0)
const newComment = ref<string>("")

const handleCreateComment = async () => {
  try {
    const resCom = await axios.post(
      `http://localhost:3000/api/report/${props.report?._id}/comments`,
      { comment: newComment.value },
      { withCredentials: true }) 

    if(resCom.data) {
      newComment.value = ""
      emit('create', [resCom.data, ...props.commentList])
      const report = reportStore.reports.find(r => r._id == props.report?._id)
      
      if (report) {
        report.commentCount++
        commentCount.value ++
      }
      reportStore.fetchReports()
    }
  } catch (error) {
    console.error(error)
  }
}

const autoGrow = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  el.style.height = "24px"
  el.style.height = el.scrollHeight + "px"
}
</script>

<template>
  <div class="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
    <div class="flex">
      <img
        :src="userStore.currentUser?.avatar_url || userPlaceholder"
        alt="avatar"
        class="w-[25px] h-[25px] rounded-full"
        @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
      >
      <textarea 
        name="newComment"
        id="newComment"
        v-model="newComment"
        @input="autoGrow"
        class="resize-none w-full border-b border-neutral-300 ml-2 h-[24px] focus:outline-none scrollbar-none"
      >
      </textarea>
      <ChevronIcon 
        class="cursor-pointer"
        @click="handleCreateComment"
      />
    </div>
    <CommentComp 
      v-for="comment in commentList"
      :key="comment.author_id._id"
      :comment="comment"
    />
  </div>
</template>
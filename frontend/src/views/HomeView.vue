<script setup lang="ts">
import { onMounted, ref } from 'vue';

import FilterBar from '@/components/feature/home/FilterBar.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseMapbox from '@/components/shared/BaseMapbox.vue';
import { useUserStore } from '@/stores/userStore';
import avatarPlaceholder from '@/assets/img/Avatar placeholder.png'
import GearIcon from '@/components/icons/GearIcon.vue';
import ReportCard from '@/components/feature/home/ReportCard.vue';
import { useReportStore } from '@/stores/reportStore';
import BaseModal from '@/components/shared/ReportModal.vue';
import type { ReportData } from '@/types/Report';

const userStore = useUserStore()
const reportStore = useReportStore()

const isModalOpen = ref(false)
const selectedReport = ref<ReportData | null>()

onMounted(async () => {
  if(!reportStore.reports) {
    reportStore.fetchReports()
  }
})

const handleCreateModal = () => {
  selectedReport.value = null
  isModalOpen.value = true
}
</script>

<template>
  <div class="relative w-full h-full select-none">
    <BaseModal
      v-if="isModalOpen"
      @click="isModalOpen = false"
    />
    <BaseMapbox class="absolute top-0 left-0"/>
    <div class="absolute flex flex-col top-0 left-0 h-full w-fit pl-4 py-4">
      <div class="flex flex-col h-full w-[370px] bg-neutral-100 rounded-lg p-2 z-10">
        <ReportCard 
          v-for="report in reportStore.reports"
          :key="report._id"
          :report="report"
        />
      </div>
      <a v-if="!userStore.currentUser" href="/login" class="flex shrink-0 items-center justify-center bg-(--blue) hover:bg-(--blue_hover) transition-colors mt-4 h-[56px] text-white font-bold rounded-lg cursor-pointer">
        <p class="text-white text-center">Se connecter</p>
      </a>
      <div v-else class="flex items-center justify-between px-2 shrink-0 h-[56px] bg-white mt-4 rounded-lg">
        <div class="flex items-center">
          <img :src="avatarPlaceholder" alt="Avatar" class="h-[49px] w-[49px] rounded-full mr-1">
          <p>Username</p>
        </div>
        <GearIcon class="cursor-pointer"/>
      </div>
    </div>
    <FilterBar class="absolute top-4 left-[398px]"/>
    <BaseButton
      class="absolute bottom-4 left-[398px] py-3 px-3 bg-(--blue) hover:bg-(--blue_hover) disabled:bg-neutral-400"
      :disable="userStore.currentUser ? true : false"
      :onclick="() => handleCreateModal()"
    >
      <PlusIcon class="h-7 w-7 text-white stroke-3"/>
    </BaseButton>
  </div>
</template>
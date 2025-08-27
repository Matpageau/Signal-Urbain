<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import userPlaceholder from '@/assets/img/Avatar placeholder.png'
import { computed, onMounted, ref, watch } from 'vue';
import type { categoryEnum, ReportData } from '@/types/Report';
import FilterBar from '@/components/feature/home/FilterBar.vue';
import ReportCard from '@/components/feature/home/ReportCard.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseModal from '@/components/shared/ReportModal.vue';
import { useI18n } from 'vue-i18n';
import { useReportStore } from '@/stores/reportStore';
import PaginatorComp from '@/components/feature/proifle/PaginatorComp.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import axios from 'axios';
import router from '@/router';

const { locale, t } = useI18n()

const reportStore = useReportStore()
const userStore = useUserStore()

const selectedCategories = ref<categoryEnum[]>([]);
const isModalOpen = ref(false)
const selectedReport = ref<ReportData>()
const page = ref<number>(0)

onMounted(async () => {
  reportStore.fetchFollowedReports(page.value)
})

const handleFilterChange = (categories: categoryEnum[]) => {  
  selectedCategories.value = categories
};

const filteredReports = computed(() => {
  if (!selectedCategories.value.length) return reportStore.followedReports;

  return reportStore.followedReports.filter(report =>
    selectedCategories.value.includes(report.category)
  );
});

const handleReportModal = (report: ReportData) => {
  selectedReport.value = report
  isModalOpen.value = true
}

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:3000/api/user/logout', {}, { withCredentials: true })

    userStore.currentUser = null;
    router.push('/app');

  } catch (error) {
    console.error(error);
  }
}

watch(locale, (newLang) => {
  document.cookie = `lang=${newLang}; path=/; max-age=31536000`; 
});
</script>

<template>
  <div class="flex w-full h-full overflow-hidden">
    <BaseModal
      v-if="isModalOpen"
      :report="selectedReport"
      @close="isModalOpen = false"
    />
    <div class="w-full flex p-5">
      <div class="flex flex-col w-2/3 h-full">
        <a href="/" class="text-xl">{{ t('BACKONAPP') }}</a>

        <div class="m-5 flex flex-col flex-1 min-h-0">
          <div class="flex items-center">
            <img 
              :src="userStore.currentUser?.avatar_url || userPlaceholder"
              alt="avatar"
              class="w-[75px] h-[75px] rounded-full"
              @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
            >
            <h1 class="ml-3 text-3xl font-bold">{{ userStore.currentUser?.username }}</h1>
          </div>
          <div class="flex flex-col mt-10 flex-1 min-h-0">
            <div class="flex text-xl">
              <h2 class="font-bold">{{ t('FOLLOWEDREPORTS') }}</h2>
              <p class="ml-1">({{ filteredReports.length }})</p>
            </div>
            <div class="flex items-center justify-between">
              <FilterBar class="mt-1" @change="handleFilterChange"/>
              <PaginatorComp :total-items="reportStore.followedReportsCount"/>
            </div>
            <div class="grid grid-cols-3 gap-2 mt-5 overflow-y-auto scrollbar-none flex-1 min-h-0">
              <ReportCard 
                v-for="report in filteredReports"
                :key="report._id"
                :report="report"
                @click="() => handleReportModal(report)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center w-1/3 border-l border-neutral-200 p-20">
        <div class="flex w-full justify-between items-center">
          <h1 class="text-xl font-bold">{{ t('SETTINGS') }}</h1>
          <BaseButton 
            class="rounded-lg text-white p-3 bg-(--blue) hover:bg-(--blue_hover)" 
            @click="handleLogout"
            >
            Logout
          </BaseButton>
        </div>
        <div class="mt-3 w-full">
          <BaseInput 
            type="select"
            v-model="locale"
            :options="[
              {label: 'Francais', value: 'fr'},
              { label: 'English', value: 'en' },
              { label: 'Español', value: 'es' }
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
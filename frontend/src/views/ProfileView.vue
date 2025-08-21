<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import userPlaceholder from '@/assets/img/Avatar placeholder.png'
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import type { categoryEnum, ReportData } from '@/types/Report';
import FilterBar from '@/components/feature/home/FilterBar.vue';
import ReportCard from '@/components/feature/home/ReportCard.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n()
const userStore = useUserStore()

const followedReports = ref<ReportData[]>([])
const selectedCategories = ref<categoryEnum[]>([]);

onMounted(async () => {
  try {
    const followedRes = await axios.get(`http://localhost:3000/api/report/followed`, { withCredentials: true })

    if(followedRes.data) {
      followedReports.value = followedRes.data
    }
  } catch (error) {
    console.error(error);
  }
})

const handleFilterChange = (categories: categoryEnum[]) => {  
  selectedCategories.value = categories
};

const filteredReports = computed(() => {
  if (!selectedCategories.value.length) return followedReports.value;

  return followedReports.value.filter(report =>
    selectedCategories.value.includes(report.category)
  );
});

watch(locale, (newLang) => {
  document.cookie = `lang=${newLang}; path=/; max-age=31536000`; 
});

</script>

<template>
  <div class="flex w-full h-full">
    <div class="w-full flex m-5">
      <div class="w-2/3">
        <a href="/" class="text-xl">{{ t('BACKONAPP') }}</a>
        <div class="mt-5 m-5">
          <div class="flex items-center">
            <img 
              :src="userStore.currentUser?.avatar_url || userPlaceholder"
              alt="avatar"
              class="w-[75px] h-[75px] rounded-full"
              @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
            >
            <h1 class="ml-3 text-3xl font-bold">{{ userStore.currentUser?.username }}</h1>
          </div>
          <div class="mt-10">
            <div class="flex text-xl">
              <h2 class="font-bold">{{ t('FOLLOWEDREPORTS') }}</h2>
              <p class="ml-1">({{ filteredReports.length }})</p>
            </div>
            <FilterBar class="mt-1" @change="handleFilterChange"/>
            <div class="grid grid-cols-3 overflow-y-scroll scrollbar-none">
              <ReportCard 
                v-for="report in filteredReports"
                :key="report._id"
                :report="report"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center w-1/3 border-l border-neutral-200 p-20">
        <h1 class="text-xl font-bold">{{ t('SETTINGS') }}</h1>
        <div class="mt-3 w-full">
          <BaseInput 
            type="select"
            v-model="locale"
            :options="[
              {label: 'Francais', value: 'fr'},
              {label: 'English', value: 'en'}
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { categoryEnum, statusEnum, type ReportData } from '@/types/Report';
import PlusIcon from '../icons/PlusIcon.vue';
import BaseButton from './BaseButton.vue';
import PinComp from './PinComp.vue';
import { useReportUtils } from '@/composables/useReportUtils';
import elementPlaceholder from '@/assets/img/elementor-placeholder-image.png'
import SelectMap from '../feature/modal/SelectMap.vue';
import BaseInput from './BaseInput.vue';
import axios, { AxiosError } from 'axios';
import { useReportStore } from '@/stores/reportStore';
import { useI18n } from 'vue-i18n';
import CommentSection from '../feature/modal/CommentSection.vue';
import type { CommentData } from '@/types/Comment';
import { useUserStore } from '@/stores/userStore';
import { UserRoleEnum } from '@/types/User';
import type { ApiError } from '@/types/ApiError';

const { getType, getStatus, getNeighborhood } = useReportUtils()

const { t } = useI18n()
const userStore = useUserStore()
const reportStore = useReportStore()

const props = defineProps<{
  report?: ReportData
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()


const errorsMsgs = ref<string[]>([])
const neighborhood = ref<string>(t('LOADING'))
const commentList = ref<CommentData[]>([])

const report = ref<ReportData | undefined>(props.report)
const coord = ref<[number, number] | undefined>(props.report?.long != undefined && props.report.lat != undefined ? [props.report.long, props.report.lat] : undefined)
const category = ref<categoryEnum>(props.report?.category ?? categoryEnum.OTHER)
const description = ref<string>('')
const image1 = ref<string>(props.report?.medias[0] ?? "")
const image2 = ref<string>(props.report?.medias[1] ?? "")
const image3 = ref<string>(props.report?.medias[2] ?? "")
const status = ref<statusEnum>(props.report?.status ?? statusEnum.CREATED)

onMounted(async () => {
  if(props.report) {
    const [resNeighborhood, resComments] = await Promise.allSettled([
      getNeighborhood(props.report?.long, props.report.lat),
      axios.get(`http://localhost:3000/api/report/${props.report._id}/comments`)
    ])
    
    if(resNeighborhood.status == 'fulfilled') {
      neighborhood.value = resNeighborhood.value
    } else {
      console.error("Error neighborhood", resNeighborhood.reason)
    }

    if(resComments.status == 'fulfilled') {
      commentList.value = resComments.value.data.slice().reverse()
    } else {
      console.error("Error comments", resComments.reason)
    }
  }  
})

const handleCreateReport = async () => {
  try {
    const payload = {
      category: category.value,
      description: description.value,
      long: coord.value?.[0],
      lat: coord.value?.[1],
      medias: [image1.value, image2.value, image3.value]
    }
    const repRes = await axios.post('http://localhost:3000/api/report', payload)

    if(repRes.data) {
      await reportStore.fetchReports()
      emit('close')
    }
  } catch (error) {
    const err = error as AxiosError<ApiError[]>

    if (err.response?.data) {
      errorsMsgs.value = err.response.data.map(e => e.errorKey);
    } else {
      errorsMsgs.value = ["Unknown error occurred"];
    }
    console.error(error)
  }
}

watch(() => coord.value, async (newCoord) => {
  if(newCoord) {    
    neighborhood.value = await getNeighborhood(newCoord[0], newCoord[1])
  }
})

watch(() => status.value, async (newStatus) => {
  if(newStatus) {
    try {      
      const upRes = await axios.patch(`http://localhost:3000/api/report/${props.report?._id}/update`, {status: status.value}, {withCredentials: true})      
      
      if(upRes.data) {
        const index = reportStore.reports.findIndex(r => r._id == upRes.data._id)
        reportStore.reports[index] = upRes.data
        report.value = upRes.data
        category.value = upRes.data.category
      }
    } catch (error) {
      console.error(error)
    }
  }
})

watch([coord, category, description, image1, image2, image3], () => {
  errorsMsgs.value = []
})
</script>

<template>
  <div class="absolute justify-center items-center flex top-0 left-0 w-full h-full z-100 bg-white/20">
    <div class="flex flex-col relative bg-white w-full lg:w-1/2 h-full lg:h-3/4 rounded-lg p-3">
      <div class="flex justify-between">
        <div class="flex">
          <PinComp :pin-data="{category: category, status: status, upvote: props.report?.upvote_user_ids.length}"/>
          <div class="ml-2">
            <div class="flex items-center">
              <h1 class="font-bold lg:text-2xl">{{ getType(category) }}</h1>
              <div class="hidden lg:flex items-center ">
                <div class="w-[20px] h-[1px] bg-black ml-3 mr-1"></div>
                <p class="italic">{{ getStatus(status) ?? t('CREATING') }}</p>
              </div>
            </div>
            <p class="text-neutral-500">{{ neighborhood }}</p>
          </div>
        </div>
        <div class="flex items-center h-1/2">
          <BaseInput
            v-if="userStore.currentUser?.role == UserRoleEnum.CITYADMIN"
            type="select"
            v-model="status"
            :options="[
              {label: t('CREATED') , value: statusEnum.CREATED},
              {label: t('INPROGRESS') , value: statusEnum.INPROGRESS},
              {label: t('RESOLVED') , value: statusEnum.RESOLVED},
            ]"
          />
          <BaseButton 
            v-if="!report"
            class="px-4 mr-4 bg-(--blue) hover:bg-(--blue_hover) text-white"
            @click="handleCreateReport"
          >
            {{ t('SAVE') }}
          </BaseButton>
          <PlusIcon class="rotate-45 cursor-pointer" :onclick="() => emit('close')"/>
        </div>
      </div>
      <div class="flex flex-1 min-h-0 flex-col overflow-y-auto">
        <div class="grid grid-cols-3 lg:grid-cols-5 grid-rows-2 lg:grid-rows-1 mt-1 gap-4 pb-4 border-b border-neutral-300">
          <div class="col-span-3 flex h-[150px] lg:h-[250px]">
            <img 
              :src="image1"
              alt="media 1"
              @error="($event) => ($event.target as HTMLImageElement).src = elementPlaceholder"
              class="w-2/5 object-cover rounded-lg h-full"
            >
            <div class="w-3/5 grid grid-rows-2 gap-3 ml-3">
              <img
                :src="image2"
                alt="media 2"
                @error="($event) => ($event.target as HTMLImageElement).src = elementPlaceholder"
                class="w-full h-full object-cover rounded-lg"
              />
              <img 
                :src="image3"
                alt="media 3"
                @error="($event) => ($event.target as HTMLImageElement).src = elementPlaceholder"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div :class="['col-span-3 lg:col-span-2 h-full rounded-2xl overflow-hidden', {'border border-red-500': errorsMsgs.includes('POSITION_REQUIRED')}]">
            <SelectMap
              :coord="coord"
              :report="report"
              :pin-data="{category: category, status: statusEnum.CREATED, upvote: 1}"
              :can-move="!props.report"
              @select="(c) => coord = c"
            />
          </div>
        </div>
        <p v-if="errorsMsgs.includes('POSITION_REQUIRED')" class="self-end mr-1 text-red-500">{{ t('errors.POSITION_REQUIRED') }}</p>
        <div v-if="props.report" class="mt-3">
          <div v-if="props.report.description">
            <h1 class="font-bold">{{ t('DESCRIPTION')}}</h1>
            <p class="text-xs">{{ props.report.description }}</p>
          </div>
          <div class="mt-3">
            <div class="flex flex-col">
              <div class="flex">
                <h1 class="font-bold">{{ t("COMMENTS") }}</h1>
                <p class="ml-3">{{ commentList.length }}</p>
              </div>
              <CommentSection 
                :report="props.report"
                :comment-list="commentList"
                @create="(comments) => commentList = comments"
              />
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-5 gap-4 mt-4 justify-between">
          <div class="col-span-3">
            <div>
              <p>{{ t('GENERALINFOS') }}</p>
              <BaseInput
                v-model="category"
                type="select"
                placeholder="Type"
                :options="[
                  { label: t('POTHOLE'), value: 'pothole' },
                  { label: t('DMGELEMENT'), value: 'dmgelement' },
                  { label: t('ROADOBST'), value: 'roadobstacle' },
                  { label: t('FAULTTRAFIC'), value: 'faultylight' },
                  { label: t('DANGEROUSTREE'), value: 'dangeroustree' },
                  { label: t('VANDALISM'), value: 'vandalism' },
                  { label: t('OTHER'), value: 'other' },
                ]"
              />
            </div>
            <div class="mt-6">
              <p>Images</p>
              <div>
                <BaseInput 
                  v-model="image1"
                  type="text"
                  placeholder="Image 1"
                  :error="errorsMsgs.includes('MEDIA_REQUIRED') ? t('errors.MEDIA_REQUIRED') : ''"
                  />
                <BaseInput
                  class="mt-3"
                  v-model="image2"
                  type="text"
                  placeholder="Image 2"
                  :error="errorsMsgs.includes('MEDIA_REQUIRED') ? t('errors.MEDIA_REQUIRED') : ''"
                />
                <BaseInput
                  class="mt-3"
                  v-model="image3"
                  type="text"
                  placeholder="Image 3"
                  :error="errorsMsgs.includes('MEDIA_REQUIRED') ? t('errors.MEDIA_REQUIRED') : ''"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col col-span-2">
            <p>{{ t('DESCRIPTION') }}</p>
            <textarea  
              v-model="description"
              name="" id=""
              :class="['p-2 w-full flex-grow border border-neutral-200 rounded-lg resize-none', {'border-red-500': errorsMsgs.includes('DESCRIPTION_REQUIRED')}]">
            </textarea>
            <p v-if="errorsMsgs.includes('DESCRIPTION_REQUIRED')" class="text-red-500">{{ t('errors.DESCRIPTION_REQUIRED') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
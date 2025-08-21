<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { categoryEnum, statusEnum, type ReportData } from '@/types/Report';
import PlusIcon from '../icons/PlusIcon.vue';
import BaseButton from './BaseButton.vue';
import PinComp from './PinComp.vue';
import { useReportUtils } from '@/composables/useReportUtils';
import elementPlaceholder from '@/assets/img/elementor-placeholder-image.png'
import userPlaceholder from '@/assets/img/Avatar placeholder.png'
import SelectMap from '../feature/modal/SelectMap.vue';
import BaseInput from './BaseInput.vue';
import axios from 'axios';
import { useReportStore } from '@/stores/reportStore';
import { useUserStore } from '@/stores/userStore';
import CommentComp from '../feature/modal/CommentComp.vue';
import type { CommentData } from '@/types/Comment';
import { useI18n } from 'vue-i18n';
import ChevronIcon from '../icons/ChevronIcon.vue';

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

const commentList = ref<CommentData[]>([])
const neighborhood = ref<string>(t('LOADING'))

const coord = ref<[number, number] | undefined>(props.report?.long != undefined && props.report.lat != undefined ? [props.report.long, props.report.lat] : undefined)
const category = ref<categoryEnum>(props.report?.category ?? categoryEnum.OTHER)
const description = ref<string>('')
const image1 = ref<string>(props.report?.medias[0] ?? "")
const image2 = ref<string>(props.report?.medias[1] ?? "")
const image3 = ref<string>(props.report?.medias[2] ?? "")
const newComment = ref<string>("")

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
      commentList.value = resComments.value.data
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
    console.error(error)
  }
}

const handleCreateComment = async () => {
  try {
    const resCom = await axios.post(
      `http://localhost:3000/api/report/${props.report?._id}/comments`,
      { comment: newComment.value },
      { withCredentials: true }) 

    if(resCom.data) {
      newComment.value = ""
      commentList.value = [resCom.data, ...commentList.value]
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

watch(() => coord.value, async (newCoord) => {
  if(newCoord) {    
    neighborhood.value = await getNeighborhood(newCoord[0], newCoord[1])
  }
})
</script>

<template>
  <div class="absolute justify-center items-center flex top-0 left-0 w-full h-full z-100 bg-white/20">
    <div class="relative bg-white w-1/2 h-fit rounded-lg p-3">
      <div class="flex justify-between">
        <div class="flex">
          <PinComp :report="props.report" :pin-data="{category: category, status: statusEnum.CREATED, upvote: 1}"/>
          <div class="ml-2">
            <div class="flex items-center">
              <h1 class="font-bold text-2xl">{{ getType(category) }}</h1>
              <div class="w-[20px] h-[1px] bg-black ml-3 mr-1"></div>
              <p class="italic">{{ getStatus(props.report?.status) ?? 'Creating' }}</p>
            </div>
            <p class="text-neutral-500">{{ neighborhood }}</p>
          </div>
        </div>
        <div class="flex items-center h-1/2">
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
      <div class="grid grid-cols-5 mt-1 gap-4 pb-4 border-b border-neutral-300">
        <div class="col-span-3 flex h-[250px]">
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
        <div class="col-span-2 h-full rounded-2xl overflow-hidden">
          <SelectMap 
            :coord="coord"
            :report="props.report"
            :pin-data="{category: category, status: statusEnum.CREATED, upvote: 1}"
            :can-move="!props.report"
            @select="(c) => coord = c"
          />
        </div>
      </div>
      <div v-if="props.report" class="mt-3">
        <div v-if="props.report.description">
          <h1 class="font-bold">{{ t('DESCRIPTION')}}</h1>
          <p class="text-xs">{{ props.report.description }}</p>
        </div>
        <div class="mt-3">
          <div class="flex flex-col">
            <div class="flex">
              <h1 class="font-bold">{{ t("COMMENTS") }}</h1>
              <p class="ml-3">{{ props.report.commentCount }}</p>
            </div>
            <div class="flex flex-col gap-4">
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
                :key="comment._id"
                :comment="comment"
              />
            </div>
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
              />
              <BaseInput
                class="mt-3"
                v-model="image2"
                type="text"
                placeholder="Image 2"
              />
              <BaseInput
                class="mt-3"
                v-model="image3"
                type="text"
                placeholder="Image 3"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col col-span-2">
          <p>{{ t('DESCRIPTION') }}</p>
          <textarea  v-model="description" name="" id="" class="p-2 w-full flex-grow border border-neutral-200 rounded-lg resize-none"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
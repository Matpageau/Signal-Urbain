<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { typeEnum, type ReportData } from '@/types/Report';
import PlusIcon from '../icons/PlusIcon.vue';
import BaseButton from './BaseButton.vue';
import PinComp from './PinComp.vue';
import { getNeighborhood, getType } from '@/utils/reportUtils';
import elementPlaceholder from '@/assets/img/elementor-placeholder-image.png'
import SelectMap from '../feature/modal/SelectMap.vue';
import BaseInput from './BaseInput.vue';

const props = defineProps<{
  report?: ReportData
}>()

const neighborhood = ref<string>("Loading...")

const coord = ref<[number, number] | undefined>(props.report?.long != undefined && props.report.lat != undefined ? [props.report.long, props.report.lat] : undefined)
const type = ref<typeEnum>(props.report?.type ?? typeEnum.OTHER)
const description = ref<string>('')
const image1 = ref<string>(props.report?.media[0] ?? "")
const image2 = ref<string>(props.report?.media[1] ?? "")
const image3 = ref<string>(props.report?.media[2] ?? "")

onMounted(async () => {
  neighborhood.value = await getNeighborhood(props.report?.long, props.report?.lat)
})

watch(() => coord.value, async (newCoord) => {
  if(newCoord) {
    console.log('new coords');
    
    neighborhood.value = await getNeighborhood(newCoord[0], newCoord[1])
  }
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="absolute justify-center items-center flex top-0 left-0 w-full h-full z-100 bg-white/20">
    <div class="relative bg-white w-1/2 h-fit rounded-lg p-3">
      <div class="flex justify-between">
        <div class="flex">
          <PinComp :pin="{
            type: type
          }"/>
          <div class="ml-2">
            <div class="flex items-center">
              <h1 class="font-bold text-2xl">{{ getType(type) }}</h1>
              <div class="w-[20px] h-[1px] bg-black ml-3 mr-1"></div>
              <p class="italic">{{ props.report?.status ?? 'Creating' }}</p>
            </div>
            <p class="text-neutral-500">{{ neighborhood }}</p>
          </div>
        </div>
        <div class="flex items-center h-1/2">
          <BaseButton class="px-4 mr-4 bg-(--blue) hover:bg-(--blue_hover) text-white">
            Sauvegarder
          </BaseButton>
          <PlusIcon class="rotate-45 cursor-pointer" :onclick="() => emit('click')"/>
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
            :pin-dat="{
              type: type
            }"
            @select="(c) => coord = c"
          />
        </div>
      </div>
      <div v-if="props.report" class="mt-4">

      </div>
      <div v-else class="grid grid-cols-5 gap-4 mt-4 justify-between">
        <div class="col-span-3">
          <div>
            <p>Informations générales</p>
            <BaseInput
              v-model="type"
              type="select"
              placeholder="Type"
              :options="[
                { label: 'Nid-de-poule', value: 'pothole' },
                { label: 'Élément endommagé', value: 'dmgelement' },
                { label: 'Obstacle sur la route', value: 'roadobstacle' },
                { label: 'Feux de circulation défectueux', value: 'faultylight' },
                { label: 'Arbre problématique', value: 'dangeroustree' },
                { label: 'Vandalisme', value: 'vandalism' },
                { label: 'Autre', value: 'other' },
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
          <p>Description</p>
          <textarea  v-model="description" name="" id="" class="p-2 w-full flex-grow border border-neutral-200 rounded-lg resize-none"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
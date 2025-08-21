<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { categoryEnum } from '@/types/Report';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'change', categories: categoryEnum[]): void
}>()

const { t } = useI18n()
const filters = ref<categoryEnum[]>([])

const handleFilterChange = (category: categoryEnum) => {  
  if(filters.value.includes(category)) {
    filters.value = filters.value.filter(c => c != category)
  }else{
    filters.value.push(category)
  }  
}

watch(() => filters, (newFilters) => {  
  emit('change', newFilters.value)
}, {deep: true})
</script>

<template>
  <div class="flex gap-3">
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.POTHOLE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.POTHOLE)"
    >
      {{ t('POTHOLE') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.DMGELEMENT) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.DMGELEMENT)"
    >
      {{ t('DMGELEMENT') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.ROADOBSTACLE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.ROADOBSTACLE)"
    >
      {{ t('ROADOBST') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.FAULTYLIGHT) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.FAULTYLIGHT)"
    >
      {{ t('FAULTTRAFIC') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.DANGEROUSTREE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.DANGEROUSTREE)"
    >
      {{ t('DANGEROUSTREE') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.VANDALISM) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.VANDALISM)"
    >
      {{ t('VANDALISM') }}
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.OTHER) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.OTHER)"
    >
      {{ t('OTHER') }}
    </BaseButton>
  </div>
</template>
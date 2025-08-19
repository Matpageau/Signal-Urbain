<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { categoryEnum } from '@/types/Report';

const emit = defineEmits<{
  (e: 'change', categories: categoryEnum[]): void
}>()

const filters = ref<categoryEnum[]>([])

const handleFilterChange = (category: categoryEnum) => {
  if(filters.value.includes(category)) {
    filters.value = filters.value.filter(c => c != category)
  }else{
    filters.value.push(category)
  }  
}

watch(() => filters.value, (newFilters) => {
  emit('change', newFilters)
})
</script>

<template>
  <div class="flex gap-3">
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.POTHOLE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.POTHOLE)"
    >
      Nid-de-poule
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.DMGELEMENT) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.DMGELEMENT)"
    >
      Elements brisés
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.ROADOBSTACLE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.ROADOBSTACLE)"
    >
      Route obstruée
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.FAULTYLIGHT) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.FAULTYLIGHT)"
    >
      Feux de circulation défectueux
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.DANGEROUSTREE) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.DANGEROUSTREE)"
    >
      Arbre problématique
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.VANDALISM) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.VANDALISM)"
    >
      Vandalisme
    </BaseButton>
    <BaseButton 
      :class="['px-2', filters.includes(categoryEnum.OTHER) ? 'bg-(--blue) text-white' : 'bg-white']"
      @click="() => handleFilterChange(categoryEnum.OTHER)"
    >
      Autres
    </BaseButton>
  </div>
</template>
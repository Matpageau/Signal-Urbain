<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SmallReportCard from '@/components/feature/home/SmallReportCard.vue';
import { categoryEnum } from '@/types/Report';

import UserIcon from '@/components/icons/UserIcon.vue';
import PinIcon from '@/components/icons/PinIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import BaseInput from '@/components/shared/BaseInput.vue';

const { locale } = useI18n();
</script>

<template>
  <div class="overflow-y-auto flex w-full h-full flex-col items-center bg-white gap-10">

    <div class="flex flex-row justify-between items-center px-90 py-8 w-full min-h-12 bg-[#008CFF]">
      <h3 class="text-2xl font-semibold text-neutral-100"> Signal Urbain </h3>
      
      <div class="flex flex-row items-center gap-12">
        <a href="/login" class="text-neutral-100 font-semibold px-1 pb-1 hover:bg-white rounded-md hover:text-[#008CFF]"> {{ $t('SIGNIN')}} </a>
        <a href="/register" class="text-neutral-100 font-semibold px-1 pb-1 hover:bg-white rounded-md hover:text-[#008CFF]"> {{ $t('SIGNUP')}} </a>
      
        <div class="flex flex-row gap-3">
          <BaseInput
            type="select"
            v-model="locale"
            class="bg-[#008CFF] text-neutral-100 border-0 focus:ring-0 focus:outline-0 hover:bg-white hover:rounded-md hover:text-[#008CFF]"
            :dropdownClass="'bg-[#008CFF] text-neutral-100 border-0 focus:ring-0 focus:outline-0 hover:rounded-md hover:text-[#008CFF] '"
            :options="[
              { label: 'FR', value: 'fr'},
              { label: 'EN', value: 'en' },
              { label: 'ES', value: 'es' },
              { label: '中文', value: 'ma' }
            ]"
          />
        </div>
        
      </div>
    </div>
    
    <div class="rounded-lg bg-white w-5/8 flex flex-col items-center">
      <div class="flex text-center w-5/8 flex-col py-12">
        <h1 class="text-[#1E1E1E] font-bold text-3xl">{{ $t('SLOGAN') }}</h1>
        <p class="text-[#1E1E1E]">{{ $t('HOME_INTRO') }}</p>
      </div>
      
      <div class="grid grid-rows-2 grid-cols-3 gap-3 ">
        <SmallReportCard :report-icon="categoryEnum.POTHOLE" 
        report-name="POTHOLE" 
        report-desc="POTHOLE_DESC"
        color="fcba03"/>
        <SmallReportCard :report-icon="categoryEnum.DMGELEMENT"
        report-name="DMGELEMENT" 
        report-desc="DMGELEMENT_DESC"/>
        <SmallReportCard :report-icon="categoryEnum.ROADOBSTACLE"
        report-name="ROADOBST" 
        report-desc="ROADOBST_DESC"/> 
        <SmallReportCard :report-icon="categoryEnum.FAULTYLIGHT"
        report-name="FAULTTRAFIC" 
        report-desc="FAULTTRAFIC_DESC"/> 
        <SmallReportCard :report-icon="categoryEnum.DANGEROUSTREE"
        report-name="DANGEROUSTREE" 
        report-desc="DANGEROUSTREE_DESC"/> 
        <SmallReportCard :report-icon="categoryEnum.VANDALISM"
        report-name="VANDALISM" 
        report-desc="VANDALISM_DESC"/>      
      </div>
    </div>

    <div class="w-full py-10 px-4 bg-[#008CFF]">
      <div class="flex flex-col text-center">
        <h3 class="text-3xl font-bold mb-6 text-white">{{ $t('READY') }}</h3>
        <p class="text-xl mb-10 text-blue-100 leading-relaxed">{{ $t('JOIN') }}</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">        
            <a
              size="lg"
              class="rounded-lg text-lg px-8 py-4 bg-white text text-[#008CFF] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              href="/app"
            >
            {{ $t('GOAPP') }}
          </a>
          <div class="flex flex-row sm:flex-row gap-4 justify-center">
            <a
              size="lg" href="/register"
              class="rounded-lg text-lg px-8 py-4 bg-white text text-[#008CFF] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
              {{ $t('SIGNUPNOW') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h3 class="text-3xl font-bold mb-4 text-gray-900">{{ $t('IMPACT') }}</h3>
            <p class="text-gray-600 text-lg">{{  $t('TOGETHER') }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center group">
              <div class="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <UserIcon class="h-10 w-10 text-blue-600" />
              </div>
              <h4 class="text-3xl font-bold text-gray-900 mb-2">2,847</h4>
              <p class="text-gray-600 text-lg">{{ $t('ACTIVEUSERS') }}</p>
            </div>
            <div class="text-center group">
              <div class="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <PinIcon class="h-10 w-10 text-green-600" />
              </div>
              <h4 class="text-3xl font-bold text-gray-900 mb-2">1,234</h4>
              <p class="text-gray-600 text-lg">{{ $t('TOTALREPORTS') }}</p>
            </div>
            <div class="text-center group">
              <div class="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckIcon class="h-10 w-10 text-purple-600" />
              </div>
              <h4 class="text-3xl font-bold text-gray-900 mb-2">892</h4>
              <p class="text-gray-600 text-lg">{{ $t('RESOLVEDREPORTS') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-1/2 border-t border-gray-800 mt-4 py-4 text-center text-gray-500">
        <p>&copy; 2024 SignalUrbain. {{ $t('RIGHTS')}}</p>
      </div>
  </div>
</template>
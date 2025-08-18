import type { ReportData } from "@/types/Report";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useReportStore = defineStore('report', () => {
  const reports = ref<ReportData[]>([])
  const isFetching = ref(false)
  const isReady = ref(false)
  let fetchPromise: Promise<void> | null = null

  const fetchReports = async () => {
    if (isFetching.value && fetchPromise) return fetchPromise

    isFetching.value = true
    fetchPromise = axios
    .get<ReportData[]>('http://localhost:3000/api/report/get')
    .then(res => {
      reports.value = res.data
    }).catch(() => {
      reports.value = []
    })
    .finally(() => {
      isFetching.value = false
      isReady.value = true
      fetchPromise = null
    })

    return fetchPromise
  }

  return {
    reports,
    isReady,
    fetchReports
  }
})
import { categoryEnum, type ReportData } from "@/types/Report";
import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useReportStore = defineStore('report', () => {
  const reports = ref<ReportData[]>([])
  const isFetching = ref(false)
  const isReady = ref(false)
  let fetchPromise: Promise<void> | null = null
  
  const fetchReports = async () => {
    if (isFetching.value && fetchPromise) return fetchPromise

    isFetching.value = true
    fetchPromise = axios.get<ReportData[]>('http://localhost:3000/api/report')
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

  const getReportsByCategory = (categories: categoryEnum[]) => {
    return computed(() => 
      reports.value.filter(r => categories.includes(r.category))
    )
  }

  const upvoteReport = async (id: string) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/report/${id}/upvote`, {}, { withCredentials: true })

      const index = reports.value.findIndex(r => r._id == id)
      if(index != -1) {
        reports.value[index] = res.data
      }
    } catch (error) {
      console.error("Erreur upvote", error)
    }
  }

  return {
    reports,
    isReady,
    fetchReports,
    getReportsByCategory,
    upvoteReport
  }
})
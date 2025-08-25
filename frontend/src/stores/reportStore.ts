import { categoryEnum, type ReportData } from "@/types/Report";
import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useReportStore = defineStore('report', () => {
  const reports = ref<ReportData[]>([])
  const followedReports = ref<ReportData[]>([])
  const followedReportsCount = ref<number>(0)
  const isFetching = ref(false)
  const isReady = ref(false)
  let fetchPromise: Promise<void> | null = null
  
  const fetchReports = async () => {
    if (isFetching.value && fetchPromise) return fetchPromise

    isFetching.value = true
    fetchPromise = axios.get<ReportData[]>('http://localhost:3000/api/report')
    .then(res => {     
      reports.value = res.data.sort((a, b) => b.upvote_user_ids.length - a.upvote_user_ids.length)
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

  const fetchFollowedReports = async (page: number) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/report/followed?limit=9&page=${page}`, { withCredentials: true })
      followedReports.value = res.data.reports
      followedReportsCount.value = res.data.reportsCount
    } catch (error) {
      console.error(error)
      followedReports.value = []
    }
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
        reports.value.sort((a, b) => b.upvote_user_ids.length - a.upvote_user_ids.length)
      }

      const followedIndex = followedReports.value.findIndex(r => r._id == id)
      if(res.data.upvote_user_ids.includes(res.data._id)) {
        if(followedIndex == -1) {
          followedReports.value.push(res.data)
        } else {
          followedReports.value[followedIndex] = res.data
        }
      } else {
        if( followedIndex != -1) {
          followedReports.value.splice(followedIndex, 1)
        }
      }
    } catch (error) {
      console.error("Erreur upvote", error)
    }
  }

  return {
    reports,
    followedReports,
    followedReportsCount,
    isReady,
    fetchReports,
    fetchFollowedReports,
    getReportsByCategory,
    upvoteReport
  }
})
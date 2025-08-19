import { statusEnum, categoryEnum, type ReportData } from "@/types/Report";
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

      reports.value.push({
        _id: 'adadauihdun',
        comments: [],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.",
        lat: 46.8687,
        long: -71.2504,
        media: ["https://www.unionmutual.com/wp-content/uploads/2016/07/Potholes-resized-for-blog.jpg"],
        status: statusEnum.CREATED,
        category: categoryEnum.POTHOLE,
        upvote: 200
      })
    })

    return fetchPromise
  }

  const getReportsByCategory = (categories: categoryEnum[]) => {
    return computed(() => 
      reports.value.filter(r => categories.includes(r.category))
    )
  }

  return {
    reports,
    isReady,
    fetchReports,
    getReportsByCategory
  }
})
import type { categoryEnum, statusEnum } from "@/types/Report"
import axios from "axios"
import i18n from "@/utils/i18n"

import PotholeIcon from '../components/icons/type/PotholeIcon.vue'
import BrokenWallIcon from '../components/icons/type/BrokenWallIcon.vue';
import RoadObstacleIcon from '../components/icons/type/RoadObstavleIcon.vue';
import TrafficIcon from '../components/icons/type/TrafficIcon.vue';
import TreeIcon from '../components/icons/type/TreeIcon.vue';
import VandalismIcon from '../components/icons/type/VandalismIcon.vue';
import OtherIcon from '../components/icons/type/OtherIcon.vue';


export function useReportUtils() {
  const { t } = i18n.global
  
  const getType = (type?: categoryEnum): string => {
    switch (type) {
      case 'pothole': return t('POTHOLE')
      case 'dmgelement': return t('DMGELEMENT')
      case 'roadobstacle': return t('ROADOBST')
      case 'faultylight': return t('FAULTTRAFIC')
      case 'dangeroustree': return t('DANGEROUSTREE')
      case 'vandalism': return t('VANDALISM')
      case 'other':
      default: return t('OTHER')
    }
  }

  const getIconType = (category?: categoryEnum) => {
  switch (category) {
    case 'pothole':
      return PotholeIcon
    case 'dmgelement':
      return BrokenWallIcon
    case 'roadobstacle':
      return RoadObstacleIcon
    case 'faultylight':
      return TrafficIcon
    case 'dangeroustree':
      return TreeIcon
    case 'vandalism':
      return VandalismIcon
    case 'other':
    default:
      return OtherIcon
  }
}
  
  const getStatus = (status?: statusEnum): string => {
    switch (status) {
      case 'created': return t("CREATED")
      case 'in_progress': return t("INPROGRESS")
      case 'resolved': return t("RESOLVED")
      default: return t("CREATED")
    }
  }
  
  const getNeighborhood = async (long?: number, lat?: number): Promise<string> => {
    if(long && lat) {
      const resGeo = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&types=neighborhood%2Clocality%2Cplace&limit=1&worldview=us&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
      const feature = resGeo.data.features[0]
      
      return feature.properties.name ?? 'error'
    }
    else{
      return "Select a point"
    }
  }

  return { getType, getIconType, getStatus, getNeighborhood }
}

import type { typeEnum } from "@/types/Report"
import axios from "axios"

export const getType = (type?: typeEnum): string => {
  switch (type) {
    case 'pothole':
      return "Pothole"

    case 'dmgelement':
      return "Dammaged element"

    case 'roadobstacle':
      return "Road obstacle"

    case 'faultylight':
      return "Faulty trafic light"

    case 'dangeroustree':
      return "Dangerous tree"

    case 'other':
    default:
      return "Other"
  }
}

export const getNeighborhood = async (long?: number, lat?: number): Promise<string> => {
  if(long && lat) {
    const resGeo = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&types=neighborhood%2Clocality%2Cplace&limit=1&worldview=us&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
    const feature = resGeo.data.features[0]
    
    return feature.properties.name ?? 'error'
  }
  else{
    return "Select a point"
  }
}
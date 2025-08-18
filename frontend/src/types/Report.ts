export type ReportData = {
  _id: string
  comments: string[]
  type: typeEnum
  description: string
  long: number
  lat: number
  status: statusEnum
  upvote: number
  media: string[]
}

export enum typeEnum  {
  POTHOLE = 'pothole',
  DMGELEMENT = 'dmgelement',
  ROADOBSTACLE = 'roadobstacle',
  FAULTYLIGHT = 'faultylight',
  DANGEROUSTREE = 'dangeroustree',
  VANDALISM = 'vandalism',
  OTHER = 'other'
}

export enum statusEnum {
  CREATED = 'created',
  INPROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}
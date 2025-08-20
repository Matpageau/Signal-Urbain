export type ReportData = {
  _id: string
  comments: string[]
  category: categoryEnum
  description: string
  long: number
  lat: number
  status: statusEnum
  upvote_user_ids: string[]
  medias: string[]
  commentCount: number
}

export enum categoryEnum  {
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
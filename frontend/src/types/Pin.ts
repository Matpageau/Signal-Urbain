import type { statusEnum, categoryEnum } from "./Report"

export type PinData = {
  status?: statusEnum
  upvote?: number
  category?: categoryEnum
}
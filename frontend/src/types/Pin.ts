import type { statusEnum, typeEnum } from "./Report"

export type PinData = {
  status?: statusEnum
  upvote?: number
  type?: typeEnum
}
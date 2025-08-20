import type { UserData } from "./User"

export type CommentData = {
  _id?: string
  report_id: string
  author_id: string
  content: string
  author: UserData
}
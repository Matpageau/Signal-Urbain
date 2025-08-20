export type UserData = {
  _id: string
  username: string
  email: string
  password: string
  role: UserRoleEnum
  upvoted_report_id: string[]
  avatar_url: string
}

export enum UserRoleEnum {
  USER = 'user',
  CITYADMIN = 'cityadmin',
  ADMIN = 'admin'
}
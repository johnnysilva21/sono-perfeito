export interface Profile {
  id: string
  full_name: string | null
  sleep_goal: number
  created_at: string
  updated_at: string
}

export interface SleepRoutine {
  id: string
  user_id: string
  sleep_time: string
  wake_time: string
  reminders_enabled: boolean
  created_at: string
  updated_at: string
}

export interface SleepLog {
  id: string
  user_id: string
  date: string
  mood: string
  quality: number
  notes: string | null
  created_at: string
}

export interface DailyActivity {
  id: string
  user_id: string
  date: string
  time: string
  activity: string
  completed: boolean
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  author_name: string | null
  title: string
  content: string
  likes: number
  comments_count: number
  created_at: string
}

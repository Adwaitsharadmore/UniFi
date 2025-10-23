export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          timezone: string
          currency: string
          language: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          currency?: string
          language?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          currency?: string
          language?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_amount: number
          current_amount: number
          goal_type: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund'
          target_date: string | null
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_amount: number
          current_amount?: number
          goal_type: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund'
          target_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          goal_type?: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund'
          target_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string
          category: string
          transaction_type: 'income' | 'expense' | 'transfer'
          date: string
          merchant: string | null
          account: string | null
          tags: string[] | null
          goal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          description: string
          category: string
          transaction_type: 'income' | 'expense' | 'transfer'
          date?: string
          merchant?: string | null
          account?: string | null
          tags?: string[] | null
          goal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string
          category?: string
          transaction_type?: 'income' | 'expense' | 'transfer'
          date?: string
          merchant?: string | null
          account?: string | null
          tags?: string[] | null
          goal_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achievement_data: any | null
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achievement_data?: any | null
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achievement_data?: any | null
          unlocked_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_saved: number
          total_spent: number
          streak_days: number
          level: number
          experience_points: number
          badges_earned: number
          goals_completed: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_saved?: number
          total_spent?: number
          streak_days?: number
          level?: number
          experience_points?: number
          badges_earned?: number
          goals_completed?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_saved?: number
          total_spent?: number
          streak_days?: number
          level?: number
          experience_points?: number
          badges_earned?: number
          goals_completed?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

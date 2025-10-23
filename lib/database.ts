import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

type UserGoal = Database['public']['Tables']['user_goals']['Row']
type UserGoalInsert = Database['public']['Tables']['user_goals']['Insert']
type UserGoalUpdate = Database['public']['Tables']['user_goals']['Update']

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

type UserStats = Database['public']['Tables']['user_stats']['Row']

export class DatabaseService {
  private supabase = createClient()

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  }

  async createProfile(profile: ProfileInsert): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    return data
  }

  // User Goals operations
  async getUserGoals(userId: string): Promise<UserGoal[]> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user goals:', error)
      return []
    }

    return data
  }

  async createUserGoal(goal: UserGoalInsert): Promise<UserGoal | null> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .insert(goal)
      .select()
      .single()

    if (error) {
      console.error('Error creating user goal:', error)
      return null
    }

    return data
  }

  async updateUserGoal(goalId: string, updates: UserGoalUpdate): Promise<UserGoal | null> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user goal:', error)
      return null
    }

    return data
  }

  async deleteUserGoal(goalId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      console.error('Error deleting user goal:', error)
      return false
    }

    return true
  }

  // Transactions operations
  async getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }

    return data
  }

  async createTransaction(transaction: TransactionInsert): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      return null
    }

    return data
  }

  async updateTransaction(transactionId: string, updates: TransactionUpdate): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      return null
    }

    return data
  }

  async deleteTransaction(transactionId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)

    if (error) {
      console.error('Error deleting transaction:', error)
      return false
    }

    return true
  }

  // User Stats operations
  async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await this.supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user stats:', error)
      return null
    }

    return data
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | null> {
    const { data, error } = await this.supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user stats:', error)
      return null
    }

    return data
  }
}

export const db = new DatabaseService()

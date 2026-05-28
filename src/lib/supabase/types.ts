export type Database = {
  public: {
    Tables: {
      perfumes: {
        Row: {
          id: string
          name: string
          brand: string
          description: string | null
          status: 'in stock' | 'out of stock' | 'new' | 'in transit'
          price_5ml: number
          price_10ml: number
          rating: number
          review_count: number
          image_url: string | null
          notes_top: string | null
          notes_middle: string | null
          notes_base: string | null
          accords: string | null
          when_to_wear: string | null
          gender: 'male' | 'female' | 'unisex'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          description?: string | null
          status?: 'in stock' | 'out of stock' | 'new' | 'in transit'
          price_5ml: number
          price_10ml: number
          rating?: number
          review_count?: number
          image_url?: string | null
          notes_top?: string | null
          notes_middle?: string | null
          notes_base?: string | null
          accords?: string | null
          when_to_wear?: string | null
          gender?: 'male' | 'female' | 'unisex'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          description?: string | null
          status?: 'in stock' | 'out of stock' | 'new' | 'in transit'
          price_5ml?: number
          price_10ml?: number
          rating?: number
          review_count?: number
          image_url?: string | null
          notes_top?: string | null
          notes_middle?: string | null
          notes_base?: string | null
          accords?: string | null
          when_to_wear?: string | null
          gender?: 'male' | 'female' | 'unisex'
          created_at?: string
          updated_at?: string
        }
      }
      sales: { Row: Record<string, unknown>, Insert: Record<string, unknown>, Update: Record<string, unknown> }
      inventory_log: { Row: Record<string, unknown>, Insert: Record<string, unknown>, Update: Record<string, unknown> }
      reviews: { Row: Record<string, unknown>, Insert: Record<string, unknown>, Update: Record<string, unknown> }
      expenses: { Row: Record<string, unknown>, Insert: Record<string, unknown>, Update: Record<string, unknown> }
    }
  }
}

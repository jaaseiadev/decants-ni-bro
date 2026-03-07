export type Database = {
  public: {
    Tables: {
      perfumes: {
        Row: {
          id: string
          name: string
          brand: string
          description: string | null
          status: 'active' | 'out_of_stock' | 'discontinued'
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
          stock_5ml: number
          stock_10ml: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          description?: string | null
          status?: 'active' | 'out_of_stock' | 'discontinued'
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
          stock_5ml?: number
          stock_10ml?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          description?: string | null
          status?: 'active' | 'out_of_stock' | 'discontinued'
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
          stock_5ml?: number
          stock_10ml?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales: { Row: any, Insert: any, Update: any }
      inventory_log: { Row: any, Insert: any, Update: any }
      reviews: { Row: any, Insert: any, Update: any }
      expenses: { Row: any, Insert: any, Update: any }
    }
  }
}

export interface SyncLog {
    id: string
    source_system: string
    target_system: string
    action: string
    status: 'success' | 'failed'
    payload: {
      customer_id: string
      total_amount: number
      payment_method: string
    }
    response: any
    created_at: string
  }
   
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import SyncLogTable, { SyncLog } from '@/components/syncLogTable'
import CustomerPointsTable, { CustomerPoint } from '@/components/CustomerPointsTable'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


async function getSyncLogs(): Promise<SyncLog[]> {
    const res = await fetch('http://localhost:3000/api/sync-logs', {
      cache: 'no-store',
    })
  
    if (!res.ok) {
      throw new Error('Failed to fetch sync logs')
    }
  
    const data = await res.json()
    return data
  }


  async function getCustomerPoints(): Promise<CustomerPoint[]> {
    const res = await fetch('http://localhost:3000/api/points', {
      cache: 'no-store',
    })
  
    if (!res.ok) {
      throw new Error('Failed to fetch customer points')
    }
  
    return res.json()
  }
  
  
export default async function Page() {
    const logs = await getSyncLogs() // ← DI SINI definisinya
      const points = await getCustomerPoints()


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
     <AppSidebar variant="inset" />
<SidebarInset>
  <SiteHeader />
  <div className="flex flex-1 flex-col">
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Section: Summary Cards */}
        <div>
          <SectionCards />
        </div>

        {/* Section: Sync Logs */}
        <div>
          <SyncLogTable data={logs} />
        </div>

        {/* Section: Customer Points */}
        <div>
          <CustomerPointsTable data={points} />
        </div>
      </div>
    </div>
  </div>
</SidebarInset>
</SidebarProvider>

  )
}

import { AdminStats } from "@/components/admin/admin-stats"
import { QueriesChart } from "@/components/admin/queries-chart"
import { RecentLogs } from "@/components/admin/recent-logs"

export default function AdminDashboard() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="space-y-4">
                <AdminStats />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <QueriesChart />
                    <div className="col-span-3">
                        {/* Placeholder for another chart or widget */}
                        <div className="h-full rounded-xl border bg-card text-card-foreground shadow p-6">
                            <h3 className="font-semibold leading-none tracking-tight mb-4">System Health</h3>
                            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                All systems operational
                            </div>
                        </div>
                    </div>
                </div>
                <RecentLogs />
            </div>
        </div>
    )
}

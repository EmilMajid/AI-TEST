import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, AlertTriangle } from "lucide-react"

export function AdminStats() {
    // Mock data - in production this would fetch from API
    const stats = [
        {
            title: "Total Users",
            value: "1,234",
            change: "+12% from last month",
            icon: Users,
        },
        {
            title: "Documents Processed",
            value: "543",
            change: "+23% from last month",
            icon: FileText,
        },
        {
            title: "Total Queries",
            value: "12,345",
            change: "+45% from last month",
            icon: Activity,
        },
        {
            title: "System Errors",
            value: "23",
            change: "-5% from last month",
            icon: AlertTriangle,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

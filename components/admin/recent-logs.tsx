import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const logs = [
    {
        id: "1",
        level: "ERROR",
        message: "Failed to process PDF: document-123",
        timestamp: "2025-11-25 10:23:00",
    },
    {
        id: "2",
        level: "INFO",
        message: "User registration: user-456",
        timestamp: "2025-11-25 10:20:00",
    },
    {
        id: "3",
        level: "WARN",
        message: "Rate limit exceeded: 192.168.1.1",
        timestamp: "2025-11-25 10:15:00",
    },
    {
        id: "4",
        level: "INFO",
        message: "Document uploaded: biology-10.pdf",
        timestamp: "2025-11-25 10:10:00",
    },
    {
        id: "5",
        level: "ERROR",
        message: "Database connection timeout",
        timestamp: "2025-11-25 10:05:00",
    },
]

export function RecentLogs() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Recent System Logs</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Level</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Badge
                                        variant={
                                            log.level === "ERROR"
                                                ? "destructive"
                                                : log.level === "WARN"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {log.level}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.message}</TableCell>
                                <TableCell className="text-right">{log.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

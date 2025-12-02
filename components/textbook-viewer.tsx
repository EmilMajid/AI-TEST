import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, X } from "lucide-react"
import { useState } from "react"

interface TextbookViewerProps {
    isOpen: boolean
    onClose: () => void
    title: string
    fileUrl: string
}

export function TextbookViewer({ isOpen, onClose, title, fileUrl }: TextbookViewerProps) {
    const [isMaximized, setIsMaximized] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-4xl h-[80vh] flex flex-col p-0 gap-0 ${isMaximized ? "w-[95vw] max-w-[95vw] h-[95vh]" : ""}`}>
                <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMaximized(!isMaximized)}
                            className="h-8 w-8"
                        >
                            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 bg-gray-100 relative">
                    <iframe
                        src={fileUrl}
                        className="w-full h-full border-none"
                        title={title}
                        allowFullScreen
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

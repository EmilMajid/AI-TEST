"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/image-utils"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
    firstName?: string
    lastName?: string
    profileImage?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl"
}

export function ProfileAvatar({
    firstName,
    lastName,
    profileImage,
    size = "md",
    className
}: ProfileAvatarProps) {
    const initials = getUserInitials(firstName, lastName)

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            {profileImage && (
                <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
            )}
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}

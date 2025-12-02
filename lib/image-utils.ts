/**
 * Image utility functions for profile image handling
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export interface ImageValidationResult {
    valid: boolean
    error?: string
}

/**
 * Validate image file size and format
 */
export function validateImageFile(file: File): ImageValidationResult {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Şəkil çox böyükdür. Maksimum ölçü: ${formatFileSize(MAX_FILE_SIZE)}`
        }
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
        return {
            valid: false,
            error: 'Yalnız JPG, PNG və WebP formatları dəstəklənir'
        }
    }

    return { valid: true }
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            } else {
                reject(new Error('Failed to convert file to base64'))
            }
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get user initials from name
 */
export function getUserInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return first + last || '?'
}

/**
 * Compress image if needed (optional, for future use)
 */
export async function compressImage(base64: string, maxWidth: number = 800): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height

            // Calculate new dimensions
            if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }

            ctx.drawImage(img, 0, 0, width, height)

            // Convert to base64
            resolve(canvas.toDataURL('image/jpeg', 0.9))
        }

        img.onerror = () => {
            reject(new Error('Failed to load image'))
        }

        img.src = base64
    })
}

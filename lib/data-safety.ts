import fs from "fs"
import path from "path"

export interface WriteOptions {
    backup?: boolean
    backupDir?: string
    encoding?: BufferEncoding
}

/**
 * In-process async lock to serialize concurrent operations
 */
class SimpleMutex {
    private mutex = Promise.resolve()

    lock(): Promise<() => void> {
        let unlock: () => void = () => {}
        const next = new Promise<void>((resolve) => {
            unlock = resolve
        })
        const prev = this.mutex
        this.mutex = prev.then(() => next)
        return prev.then(() => unlock)
    }
}

export const offlineTestsMutex = new SimpleMutex()

/**
 * Atomically writes data to a JSON file using a temp file and renameSync.
 * Automatically creates a backup of the existing file before overwriting.
 */
export function atomicWriteJsonSync(
    targetPath: string,
    data: any,
    options: WriteOptions = {}
): void {
    const { backup = true, backupDir, encoding = "utf-8" } = options

    if (data === undefined || data === null) {
        throw new Error(`Cannot write undefined or null data to ${targetPath}`)
    }

    const serialized = typeof data === "string" ? data : JSON.stringify(data, null, 2)
    if (!serialized || serialized.length < 2) {
        throw new Error(`Refusing to write empty payload to ${targetPath}`)
    }

    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    // Pre-write backup (only if file exists and is non-empty)
    if (backup && fs.existsSync(targetPath)) {
        try {
            const stat = fs.statSync(targetPath)
            if (stat.size > 100) {
                const bDir = backupDir || path.join(dir, "backups")
                if (!fs.existsSync(bDir)) {
                    fs.mkdirSync(bDir, { recursive: true })
                }
                const baseName = path.basename(targetPath)
                const backupPath = path.join(bDir, `${baseName}.latest.bak`)
                fs.copyFileSync(targetPath, backupPath)
            }
        } catch (backupErr) {
            console.error(`Warning: Failed to create pre-write backup for ${targetPath}:`, backupErr)
        }
    }

    // Write to temporary file first
    const tmpPath = `${targetPath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
    try {
        fs.writeFileSync(tmpPath, serialized, { encoding })

        // Verify tmp file exists and is not 0 bytes
        const tmpStat = fs.statSync(tmpPath)
        if (tmpStat.size === 0) {
            throw new Error(`Temporary write resulted in 0-byte file: ${tmpPath}`)
        }

        // Atomic replace
        try {
            fs.renameSync(tmpPath, targetPath)
        } catch (renameErr: any) {
            // Windows fallback: if destination is locked or rename fails, copy and unlink
            console.warn(`renameSync failed for ${targetPath}, attempting copy fallback:`, renameErr.message)
            fs.copyFileSync(tmpPath, targetPath)
            try {
                fs.unlinkSync(tmpPath)
            } catch {}
        }
    } catch (err) {
        // Clean up tmp file on failure
        if (fs.existsSync(tmpPath)) {
            try {
                fs.unlinkSync(tmpPath)
            } catch {}
        }
        throw err
    }
}

/**
 * Synchronizes an updated subject object to its corresponding grade file (e.g. data/grades/grade_X.json)
 */
export function syncSubjectToGradeFile(subjectName: string, subjectData: any): void {
    try {
        const match = subjectName.match(/\b([2-9]|1[0-1])\b/)
        const gradeKey = match ? match[1] : "other"
        const gradeFilePath = path.join(process.cwd(), "data", "grades", `grade_${gradeKey}.json`)

        if (fs.existsSync(gradeFilePath)) {
            const raw = fs.readFileSync(gradeFilePath, "utf-8")
            const gradeDb = JSON.parse(raw)
            gradeDb[subjectName] = subjectData
            atomicWriteJsonSync(gradeFilePath, gradeDb, { backup: false })
        }
    } catch (err) {
        console.error(`Warning: Failed to sync subject "${subjectName}" to grade file:`, err)
    }
}


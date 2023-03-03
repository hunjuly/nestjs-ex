export async function sleep(timeout: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, timeout))
}

export function generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime() //Timestamp
    let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 //random number between 0 and 16

        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }

        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}

export function updateIntersection<T extends object>(obj1: T, obj2: any): T {
    const updatedObject = Object.keys(obj2).reduce((updated, key) => {
        if (key in obj1) {
            updated[key as keyof T] = obj2[key]
        }
        return updated
    }, obj1)

    return updatedObject
}

export function convertTimeToSeconds(timeString: string): number {
    const matches = timeString.match(/(\d+)\s*(s|m|h|d)?/g)

    if (!matches) {
        throw new Error('Invalid time string')
    }

    const times = matches.map((match) => {
        const [_, value, unit] = match.match(/(\d+)\s*(s|m|h|d)?/)
        let multiplier = 1

        switch (unit) {
            case 's':
                multiplier = 1
                break
            case 'm':
                multiplier = 60
                break
            case 'h':
                multiplier = 3600
                break
            case 'd':
                multiplier = 86400
                break
            /* istanbul ignore next */
            default:
                break
        }
        return parseInt(value) * multiplier
    })

    return times.reduce((prev, curr) => prev + curr, 0)
}

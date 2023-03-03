import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisService {
    private values: Map<string, string>
    private handles: Map<string, NodeJS.Timeout>

    constructor() {
        this.values = new Map<string, string>()
        this.handles = new Map<string, NodeJS.Timeout>()
    }

    onModuleDestroy() {
        this.handles.forEach((value) => {
            clearTimeout(value)
        })
    }

    async set(key: string, value: string, _expireSeconds: number): Promise<void> {
        this.values.set(key, value)

        const handle = setTimeout(() => {
            this.handles.delete(key)
            this.values.delete(key)
        }, _expireSeconds * 1000)

        const prevHandle = this.handles.get(key)
        if (prevHandle) {
            clearTimeout(prevHandle)
        }

        this.handles.set(key, handle)
    }

    async get(key: string): Promise<string> {
        return this.values.get(key)
    }

    async delete(key: string): Promise<void> {
        const handle = this.handles.get(key)
        clearTimeout(handle)

        this.handles.delete(key)
        this.values.delete(key)
    }
}

import { LogLevel, LoggerService } from '@nestjs/common'

export class NullLogger implements LoggerService {
    log(_message: any, ..._optionalParams: any[]): any {}
    error(_message: any, ..._optionalParams: any[]): any {}
    warn(_message: any, ..._optionalParams: any[]): any {}
    debug?(_message: any, ..._optionalParams: any[]): any {}
    verbose?(_message: any, ..._optionalParams: any[]): any {}
    setLogLevels?(_levels: LogLevel[]): any {}
}

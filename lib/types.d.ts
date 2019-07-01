import { FastifyInstance } from "fastify"
import { Server, IncomingMessage, ServerResponse } from "http"
import { resolve } from "url";

export interface IConfig {
  readonly host: string
  readonly port: number
  readonly commands: ICommand[]
}

export interface ICommand {
  readonly id: string
  readonly name: string
  readonly command: string
  readonly cwd: string
  readonly env: Record<string, any>
}

export interface ILogger {
  debug (message: string): void
  info (message: string): void
  warn (message: string): void
  error (message: string): void
}

export interface IServerOptions {
  host: string
  port: number
  config: IConfig
}

export type IHttpServer = FastifyInstance <Server, IncomingMessage, ServerResponse>

export interface IDeferred {
  promise: Promise<any>
  resolve(any): any
  reject(any): any
}

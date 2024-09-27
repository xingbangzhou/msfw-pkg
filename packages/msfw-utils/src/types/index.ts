export interface MsfwLinkFn {
  (on: boolean, cl: string): void
}

export interface MsfwInvokeFn {
  (...args: any[]): any
}

export interface MsfwSlotFn {
  (...args: any[]): void
}

export interface MsfwEventListener {
  (...args: any[]): void
}

export interface MsfwExtHandler {
  (...args: any[]): Promise<any>
}

export interface MsfwService {
  // 服务ID
  readonly clazz: string
  // 导出接口
  invoke(name: string, ...args: any[]): Promise<any>
  // 监听信号
  connectSignal(signal: string, slot: MsfwSlotFn): unknown
  // 取消监听信号
  disconnectSignal(signal: string, slot: MsfwSlotFn): unknown
}

export interface MsfwContextFuncs {
  /**
   * 上下文日志
   * @param name
   * @param args
   */
  log(name: string, ...args: any[]): void
  /**
   * 服务注册与反注册
   * @param service 服务类对象
   */
  register(service: MsfwService): void
  unregister(service: MsfwService): void
  /**
   * 服务监听与反监听
   * @param clazz 服务名
   * @param linker 处理函数
   */
  link(clazz: string, linker: MsfwLinkFn): void
  unlink(clazz: string, linker: MsfwLinkFn): void
  /**
   * 服务调用
   * @param clazz 服务名
   * @param name 函数名
   * @param args 参数列表
   */
  invoke(clazz: string, name: string, ...args: any[]): Promise<any>
  /**
   * 服务信号连接与反连接
   * @param clazz 服务名
   * @param signal 信号
   * @param slot 处理函数
   */
  connectSignal(clazz: string, signal: string, slot: MsfwSlotFn): void
  disconnectSignal(clazz: string, signal: string, slot: MsfwSlotFn): void
  /**
   * 全局时间分发
   * @param event 时间名
   * @param listener 监听函数
   */
  addEventListener(event: string, listener: MsfwEventListener): void
  removeEventListener(event: string, listener: MsfwEventListener): void
  postEvent(event: string, ...args: any[]): void
  /**
   * 模块上下文扩展接口
   */
  setExtHandler(name: string, handler: MsfwExtHandler): void
  invokeExt(name: string, ...args: any[]): Promise<any>
  onExtEvent(event: string, listener: MsfwEventListener): void
  offExtEvent(event: string, listener: MsfwEventListener): void
  emitExtEvent(event: string, ...args: any[]): void
}

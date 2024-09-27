import {MsfwDestructor} from '../utils'
import MsfwModuleContext from './ModuleContext'

export default class MsfwModule {
  constructor(ctx: MsfwModuleContext, destructor: MsfwDestructor) {
    this.ctx = ctx
    destructor.push(() => this.unload())
  }

  readonly ctx: MsfwModuleContext

  get id() {
    return this.ctx.moduleId
  }

  protected unload() {}
}

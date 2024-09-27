import {MsfwLauncherOption} from '../../types'
import MsfwFramework from '../Framework'
import MsfwEvents from './Events'
import MsfwModules from './Modules'
import MsfwServices from './Services'

export default class MsfwFrameworkContext {
  constructor(options?: MsfwLauncherOption) {
    this.options = options

    this.events = new MsfwEvents()
    this.modules = new MsfwModules(this)
    this.services = new MsfwServices(this)
    this.framework = new MsfwFramework(this)

    this.init()
  }

  readonly options?: MsfwLauncherOption

  readonly events: MsfwEvents

  readonly modules: MsfwModules

  readonly services: MsfwServices

  readonly framework: MsfwFramework

  get logger() {
    return this.framework.ctx.logger
  }

  private init() {
    this.logger.debug = this.options?.debug || false
  }
}

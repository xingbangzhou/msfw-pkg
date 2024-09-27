import MsfwFrameworkContext from './FrameworkContext'
import {MsfwLauncherOption} from '../types'

export default class MsfwFrameworkLauncher {
  constructor(options?: MsfwLauncherOption) {
    this._fwCtx = new MsfwFrameworkContext(options)
  }

  private _fwCtx: MsfwFrameworkContext

  get framework() {
    return this._fwCtx.framework
  }
}

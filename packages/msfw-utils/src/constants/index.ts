export enum MsfwSdkCommand {
  Ready = 'msfw-sdk:ready',
  Log = 'msfw-sdk:log',
  Link = 'msfw-sdk:link',
  Unlink = 'msfw-sdk:unlink',
  ConnectSignal = 'msfw-sdk:connect_signal',
  DisconnectSignal = 'msfw-sdk:disconnect_signal',
  Invoke = 'msfw-sdk:invoke',
  AddEventListener = 'msfw-sdk:add_event_listener',
  RemoveEventListener = 'msfw-sdk:remove_event_listener',
  PostEvent = 'msfw-sdk:post_event',
  InvokeExt = 'msfw-sdk:ctx_invoke_ext',
  OnExtEvent = 'msfw-sdk:on__ext_event',
  OffExtEvent = 'msfw-sdk:off_ext_event',
  EmitExtEvent = 'msfw-sdk:emit_ext_event',
}

export enum MsfwFrameworkCommand {
  Ready = 'msfw-framework:ready',
  LinkStatus = 'msfw-framework:link_status',
  InvokeResult = 'msfw-framework:invole_result',
  Signal = 'msfw-framework:signal',
  Event = 'msfw-framework:event',
  ExtEvent = 'msfw-framework:ext_event',
}

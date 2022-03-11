import { Middleware } from "redux"
import { PlaskEngine } from "../3d/PlaskEngine"

const stateSyncMiddleware: Middleware = (store) => (next) => (action) => {
  const prevState = store.getState()
  const result = next(action)
  PlaskEngine.GetInstance()?.onStateChanged(action, store.getState(), prevState)

  return result
}

export default stateSyncMiddleware
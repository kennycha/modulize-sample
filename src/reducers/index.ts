import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux"
import { combineReducers } from "redux"
import { theme } from './theme'
import { assets } from './assets'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  theme,
  assets,
})

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export default rootReducer
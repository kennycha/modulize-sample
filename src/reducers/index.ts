import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux"
import { combineReducers } from "redux"
import { theme } from './theme'
import { assets } from './assets'
import { animation } from './animation'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  theme,
  assets,
  animation,
})

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export default rootReducer
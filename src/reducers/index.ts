import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux"
import { combineReducers } from "redux"
import { theme } from './theme'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  theme
})

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export default rootReducer
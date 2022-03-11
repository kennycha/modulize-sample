import { ThemeAction } from "../actions/theme"

interface ThemeState {
  color: 'dark' | 'light'
}

const defaultState: ThemeState = {
  color: 'light'
}

export const theme = (state = defaultState, action: ThemeAction) => {
  switch (action.type) {
    case 'theme/CHANGE_THEME': {
      return Object.assign({}, state, {
        color: action.payload.color
      })
    }
    default: {
      return state
    }
  }
}
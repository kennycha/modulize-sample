export type ThemeAction = ReturnType<typeof changeTheme>

export const CHANGE_THEME = 'theme/CHANGE_THEME' as const
interface ChangeTheme {
  color: 'light' | 'dark'
}
export const changeTheme = (params: ChangeTheme) => ({
  type: CHANGE_THEME,
  payload: params,
})
import { FunctionComponent, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useSelector } from "../../../reducers";
import * as themeActions from '../../../actions/theme'

interface Props {}

const ControlPanel: FunctionComponent<Props> = () => {
  const theme = useSelector((state) => state.theme)
  const dispatch = useDispatch()
  
  const handleToggleThemeColor = useCallback(() => {
    if (theme.color === 'dark') {
      dispatch(themeActions.changeTheme({ color: 'light' }))
    } else {
      dispatch(themeActions.changeTheme({ color: 'dark' }))
    }
  }, [dispatch, theme.color])

  return (
    <Container>
      <span>Change Theme to </span><button onClick={handleToggleThemeColor}>{theme.color}</button>
    </Container>
  )
}

export default memo(ControlPanel)

const Container = styled.section`
  width: 100%;
  height: 100%;
`
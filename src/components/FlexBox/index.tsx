import { FunctionComponent, memo, PropsWithChildren } from "react"
import styled from "styled-components"

type FlexDirection = 'row' | 'column'
type JustfyContent = 'flex-start' | 'center'
type AlignItems = 'flex-start' | 'center'

interface Props {
  flexDirection: FlexDirection,
  justifyContent?: JustfyContent,
  alignItems?: AlignItems,
}

const FlexBox: FunctionComponent<PropsWithChildren<Props>> = ({ flexDirection, justifyContent = 'flex-start', alignItems = 'center', children }) => {
  return (
    <Container flexDirection={flexDirection} justifyContent={justifyContent} alignItems={alignItems} >{children}</Container>
  )
}

export default memo(FlexBox)

const Container = styled.div<{ flexDirection: FlexDirection, justifyContent: JustfyContent, alignItems: AlignItems }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
`
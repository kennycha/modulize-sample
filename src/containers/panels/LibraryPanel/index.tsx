import { FunctionComponent, memo } from "react";
import styled from "styled-components";

interface Props {}

const LibraryPanel: FunctionComponent<Props> = () => {
  return <Container>Library Panel</Container>
}

export default memo(LibraryPanel)

const Container = styled.section`
  width: 100%;
  height: 100%;
  border-right: 1px dotted gray;
`
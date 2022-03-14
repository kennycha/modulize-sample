import { FunctionComponent, memo, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { BabylonContext } from "../../../contexts/BabylonContext";

interface Props {}

const RenderingPanel: FunctionComponent<Props> = () => {
  const { plaskEngine } = useContext(BabylonContext)
  const renderingCanvasRef = useRef<HTMLCanvasElement>(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (renderingCanvasRef.current) {
      plaskEngine.initialize(renderingCanvasRef.current, dispatch)
    }
  }, [dispatch, plaskEngine])

  return <Canvas id="renderingCanvas" ref={renderingCanvasRef} />
}

export default memo(RenderingPanel)

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-top: 1px dotted gray;
`
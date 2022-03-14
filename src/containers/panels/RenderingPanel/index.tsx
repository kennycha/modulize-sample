import { FunctionComponent, memo, useContext, useEffect, useMemo, useRef } from "react";
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

  const multiKeyController = useMemo(
    () => ({
      v: { pressed: false },
      V: { pressed: false },
      ㅍ: { pressed: false },
      r: { pressed: false },
      R: { pressed: false },
      ㄱ: { pressed: false },
      k: { pressed: false },
      K: { pressed: false },
      ㅏ: { pressed: false },
      f: { pressed: false },
      F: { pressed: false },
      ㄹ: { pressed: false },
    }),
    [],
  );

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const targetElement = event.target as Element
      if (targetElement.tagName.toLowerCase() === 'input') {
        return
      }

      switch (event.key) {
        case 'v': case 'V': case 'ㅍ': {
          if (multiKeyController[event.key]) {
            multiKeyController[event.key].pressed = true
          }
          break
        }
        case 't': case 'T': case 'ㅅ': {
          plaskEngine.cameraModule.toOrthographic('top')
          break
        }
        case 'b': case 'B': case 'ㅠ': {
          plaskEngine.cameraModule.toOrthographic('bottom')
          break
        }
        case 'l': case 'L': case 'ㅣ': {
          plaskEngine.cameraModule.toOrthographic('left')
          break
        }
        case 'r': case 'R': case 'ㄱ': {
          if (multiKeyController[event.key]) {
            multiKeyController[event.key].pressed = true;
          }
          if ((multiKeyController.v.pressed || multiKeyController.V.pressed || multiKeyController.ㅍ.pressed) && multiKeyController[event.key].pressed) {
            plaskEngine.cameraModule.toOrthographic('right')
          }
          break
        }
        case 'f': case 'F': case 'ㄹ': {
          if (multiKeyController[event.key]) {
            multiKeyController[event.key].pressed = true;
          }
          if ((multiKeyController.v.pressed || multiKeyController.V.pressed || multiKeyController.ㅍ.pressed) && multiKeyController[event.key].pressed) {
            plaskEngine.cameraModule.toOrthographic('front')
          }
          break
        }
        case 'k': case 'K': case 'ㅏ': {
          if (multiKeyController[event.key]) {
            multiKeyController[event.key].pressed = true;
          }
          if ((multiKeyController.v.pressed || multiKeyController.V.pressed || multiKeyController.ㅍ.pressed) && multiKeyController[event.key].pressed) {
            plaskEngine.cameraModule.toOrthographic('back')
          }
          break
        }
        case 'p': case 'P': case 'ㅔ': {
          plaskEngine.cameraModule.toPerspective()
          break
        }
        case 'h': case 'H': case 'ㅗ': {
          plaskEngine.cameraModule.goHome()
          break
        }
      }
    }
    const handleKeyup = (event: KeyboardEvent) => {
      const targetElement = event.target as Element
      if (targetElement.tagName.toLowerCase() === 'input') {
        return
      }

      switch (event.key) {
        case 'v': case 'V': case 'ㅍ':
        case 'r': case 'R': case 'ㄱ':
        case 'f': case 'F': case 'ㄹ':
        case 'k': case 'K': case 'ㅏ':
          if (multiKeyController[event.key]) {
            multiKeyController[event.key].pressed = false;
          }
          break;
        default: {
          break;
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyup)
    }
  }, [multiKeyController, plaskEngine.cameraModule])

  return <Canvas id="renderingCanvas" ref={renderingCanvasRef} />
}

export default memo(RenderingPanel)

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-top: 1px dotted gray;
`
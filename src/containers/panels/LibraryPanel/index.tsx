import { ChangeEvent, FunctionComponent, memo, useContext } from "react";
import styled from "styled-components";
import { BabylonContext } from "../../../contexts/BabylonContext";
import { useSelector } from "../../../reducers";

interface Props {}

const LibraryPanel: FunctionComponent<Props> = () => {
  const { plaskEngine } = useContext(BabylonContext)
  const models = useSelector((state) => state.assets.models)
  const motions = useSelector((state) => state.assets.motions)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files![0]
    if (file) {
      plaskEngine.assetModule.importFile(file)
      event.target.value = ''
    } else {
      console.error("File doesn't exist")
    }
  }

  const handleModelClick = (id: string) => {
    if (plaskEngine.assetModule.checkModelIsVisualized(id)) {
      plaskEngine.assetModule.unvisualizeModel(id)
    } else {
      plaskEngine.assetModule.visualizeModel(id)
    }
  }

  const handleMotionClick = (id: string) => {
    plaskEngine.assetModule.selectMotion(id)
  }

  return (
    <Container>
      <input type='file' accept=".glb, .fbx" onChange={handleInputChange} />
      <div>Models</div>
      <ul>
        {models.map((model) => {
          return <li key={model.id} onClick={() => handleModelClick(model.id)}>Model: {model.name}</li>
        })}        
      </ul>
      <div>Motions</div>
      <ul>
        {motions.map((motion) => {
          return <li key={motion.id} onClick={() => handleMotionClick(motion.id)}>Motion: {motion.name}</li>
        })}
      </ul>
    </Container>
  )
}

export default memo(LibraryPanel)

const Container = styled.section`
  width: 100%;
  height: 100%;
  border-right: 1px dotted gray;

  input {

  }

  ul {
    margin: 5px;

    li {
      list-style: none;
      cursor: pointer;
      border: 1px dotted gray;
    }
  }
`
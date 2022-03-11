import { FunctionComponent, memo, useMemo } from "react"
import { Provider } from "react-redux"
import { PlaskEngine } from "../3d/PlaskEngine"
import { BabylonProvider } from "../contexts/BabylonContext"
import store from "../store"
import App from "./App"

interface Props {}

const Plask: FunctionComponent<Props> = () => {
  const plaskEngine = useMemo(() => new PlaskEngine(), [])

  return (
    <Provider store={store} >
      <BabylonProvider plaskEngine={plaskEngine}>
        <App />
      </BabylonProvider>
    </Provider>
  )
}

export default memo(Plask)
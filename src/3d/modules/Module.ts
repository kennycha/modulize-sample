import { PlaskEngine } from "../PlaskEngine";

export default abstract class Module {
  constructor(public plaskEngine: PlaskEngine) {}

  public initialize() {}

  public dispose() {}

  public onStateChanged(stateKey: string, key: string | symbol) {}

  public reduxObservedStateKeys: string[] = []
}
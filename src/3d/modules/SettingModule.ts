import { Observable } from "@babylonjs/core";
import { PlaskEngine } from "../PlaskEngine";
import Module from "./Module";

export default class SettingModule extends Module {
  public reduxObservedStateKeys = ['theme']
  public onThemeColorChangeObservable: Observable<'dark' | 'light'>

  constructor(plaskEngine: PlaskEngine) {
    super(plaskEngine)
    this.onThemeColorChangeObservable = new Observable()
  }
  
  public initialize(): void {
    this.onThemeColorChangeObservable.add((themeColor) => {
      this.plaskEngine.changeSceneClearColor(themeColor)
    })
  }

  public onStateChanged(stateKey: string, key: string | symbol): void {
    switch (stateKey) {
      case 'theme': {
        if (key === 'color') {
          this.onThemeColorChangeObservable.notifyObservers(this.themeColor)
        }
        break
      }
      default: {
        break
      }
    }
  }

  public get themeColor() {
    return this.plaskEngine.state.theme.color
  }

  public dispose(): void {
    this.onThemeColorChangeObservable.clear()
  }
}
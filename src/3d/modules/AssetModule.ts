import { Observable, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { getConvertedFileUrl, getSplitedFileName } from '../../utils';
import { Extension } from '../../utils/types';
import { PlaskMocap, PlaskModel, PlaskMotion, PlaskSkeletalModel } from "../entities";
import { PlaskEngine } from "../PlaskEngine";
import Module from "./Module";
import * as assetsActions from '../../actions/assets'

export default class AssetModule extends Module {
  private _models: (PlaskModel | PlaskSkeletalModel)[]
  // private _motions: PlaskMotion[]
  // private _mocaps: PlaskMocap[]

  public reduxObservedStateKeys = ['assets']
  public onAssetsModelsChangeObservable: Observable<(PlaskModel | PlaskSkeletalModel)[]>
  public onAssetsMotionsChangeObservable: Observable<PlaskMotion[]>
  public onAssetsMocapsChangeObservable: Observable<PlaskMocap[]>

  constructor(plaskEngine: PlaskEngine) {
    super(plaskEngine)

    this._models = []
    // this._motions = []
    // this._mocaps = []

    this.onAssetsModelsChangeObservable = new Observable()
    this.onAssetsMotionsChangeObservable = new Observable()
    this.onAssetsMocapsChangeObservable = new Observable()
  }

  public initialize() {
    this.onAssetsModelsChangeObservable.add((models) => {
      this._models = models
    }) 
    this.onAssetsMotionsChangeObservable.add((motions) => {}) 
    this.onAssetsMocapsChangeObservable.add((mocaps) => {}) 
  }

  public onStateChanged(stateKey: string, key: string | symbol): void {
    switch (stateKey) {
      case 'assets': {
        if (key === 'models') {
          this.onAssetsModelsChangeObservable.notifyObservers(this.models)
        }
        break
      }
      default: {
        break
      }
    }
  }
  
  public async importFile(file: File) {
    const [name, extension] = getSplitedFileName(file.name)
    try {
      let fileUrl: string
      // should request file upload to server later -> no need to distinguish extensions
      if (extension === 'glb') {
        fileUrl = 'https://res.cloudinary.com/dkp8v4ni8/image/upload/v1640602571/vangaurd_ncjrn5.glb' // dummy url
      } else {
        fileUrl = await getConvertedFileUrl(file, 'glb')
      }
      const assetContainer = await SceneLoader.LoadAssetContainerAsync(fileUrl, '', this.plaskEngine.scene)
      const { skeletons } = assetContainer

      let model: PlaskModel | PlaskSkeletalModel
      if (skeletons.length > 0) {
        model = new PlaskSkeletalModel(name, extension as Extension, fileUrl)
      } else {
        model = new PlaskModel(name, extension as Extension, fileUrl)
      }

      // const motions = animationGroups.map((animationGroup) => {
      //   return
      // })

      this.plaskEngine.dispatch(assetsActions.addModel({ model }))
      
      assetContainer.dispose()
    } catch (error) {
      console.error(error)
    }
  }
 
  public checkModelIsVisualized(id: string) {
    const targetModel = this._models.find((model) => model.id === id)
    if (targetModel) {
      return targetModel.isVisualized
    } else {
      console.error("Model doesn't exist")
    }
  }

  public visualizeModel(id: string) {
    const targetModel = this._models.find((model) => model.id === id)
    if (targetModel) {
      targetModel.visualize(this.plaskEngine.scene)
    } else {
      console.error("Model doesn't exist")
    }
  }

  public unvisualizeModel(id: string) {
    const targetModel = this._models.find((model) => model.id === id)
    if (targetModel) {
      targetModel.unvisualize(this.plaskEngine.scene)
    } else {
      console.error("Model doesn't exist")
    }
  }
   
  public dispose() {
    this.onAssetsModelsChangeObservable.clear()
    this.onAssetsMotionsChangeObservable.clear()
    this.onAssetsMocapsChangeObservable.clear()
  }

  public get models() {
    return this.plaskEngine.state.assets.models
  }

  public get motions() {
    return this.plaskEngine.state.assets.motions
  }

  public get mocaps() {
    return this.plaskEngine.state.assets.mocaps
  }
}
import { AssetContainer, Nullable, Scene, SceneLoader } from "@babylonjs/core";
import { Extension } from "../../utils/types";
import PlaskEntity from "./PlaskEntity";
import '@babylonjs/loaders/glTF';

export default class PlaskModel extends PlaskEntity {
  private _fileUrl: string
  
  public assetContainer: Nullable<AssetContainer>
  public isVisualized: Boolean
  // public motionIds: string[]

  constructor(name: string, extension: Extension, fileUrl: string) {
    super(undefined, name)

    this._fileUrl = fileUrl
    this.assetContainer = null
    this.isVisualized = false

    // this.motionIds = []
  }

  public async visualize(scene: Scene) {
    this.assetContainer = await SceneLoader.LoadAssetContainerAsync(this._fileUrl, '', scene)

    const { meshes, geometries } = this.assetContainer
    meshes.forEach((mesh) => {
      scene.addMesh(mesh)
      mesh.isPickable = false
    })
    geometries.forEach((geometry) => {
      scene.addGeometry(geometry)
    })
    
    this.isVisualized = true
  }

  public unvisualize(scene: Scene) {
    if (this.assetContainer) {
      this.assetContainer.dispose()
      this.assetContainer = null
    }

    this.isVisualized = false
  }

  public getClassName() {
    return 'PlaskModel'
  }
}
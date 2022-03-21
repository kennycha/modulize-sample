import { AssetContainer, Nullable, Scene, SceneLoader } from "@babylonjs/core";
import '@babylonjs/loaders/glTF';
import PlaskEntity from "./PlaskEntity";
import PlaskMotion from "./PlaskMotion";
import { PlaskExtension } from "../../utils/types";

export default class PlaskModel extends PlaskEntity {
  private _fileUrl: string
  
  public assetContainer: Nullable<AssetContainer>
  public motions: PlaskMotion[]
  public isVisualized: Boolean

  constructor(name: string, extension: PlaskExtension, fileUrl: string, motions: PlaskMotion[]) {
    super(undefined, name)

    this._fileUrl = fileUrl
    this.motions = motions
    this.assetContainer = null
    this.isVisualized = false
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
import { Nullable, Scene, SkeletonViewer } from "@babylonjs/core";
import { Extension } from "../../utils/types";
import PlaskModel from "./PlaskModel";

const DEFAULT_SKELETON_VIEWER_OPTION = {
  pauseAnimations: false,
  returnToRest: false,
  computeBonesUsingShaders: true,
  useAllBones: true,
  displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS,
  displayOptions: {
    sphereBaseSize: 0.01,
    sphereScaleUnit: 15,
    sphereFactor: 0.9,
    midStep: 0.25,
    midStepFactor: 0.05,
  },
}

export default class PlaskSkeletalModel extends PlaskModel {
  private _skeletonViewer: Nullable<SkeletonViewer>
  // private _joints: 

  constructor(name: string, extension: Extension, fileUrl: string) {
    super(name, extension, fileUrl)

    this._skeletonViewer = null
  }

  public async visualize(scene: Scene) {
    await super.visualize(scene)

    if (this.assetContainer) {
      const { meshes, skeletons } = this.assetContainer
      scene.addSkeleton(skeletons[0])
      skeletons[0]!.bones.forEach((bone) => {
        const transformNode = bone.getTransformNode()
        if (transformNode) {
          scene.addTransformNode(transformNode)
        }
      })

      this._skeletonViewer = new SkeletonViewer(skeletons[0], meshes[1], scene, true, meshes[0].renderingGroupId, DEFAULT_SKELETON_VIEWER_OPTION)
    }
  }

  public unvisualize(scene: Scene) {
    if (this._skeletonViewer) {
      this._skeletonViewer.dispose()
    }

    super.unvisualize(scene)
  }

  public getClassName() {    
    return 'PlaskSkeletalModel'
  }
}
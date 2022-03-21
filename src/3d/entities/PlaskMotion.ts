import { AbstractMesh, AnimationGroup, Scene, TransformNode } from "@babylonjs/core";
import PlaskEntity from "./PlaskEntity";
import PlaskModel from "./PlaskModel";
import PlaskSkeletalModel from "./PlaskSkeletalModel";
import PlaskLayer from "./PlaskLayer";

export default class PlaskMotion extends PlaskEntity {
  public model: PlaskModel | PlaskSkeletalModel
  public isInUse: boolean
  public layers: PlaskLayer[]

  constructor(model: PlaskModel | PlaskSkeletalModel, targets: (TransformNode | AbstractMesh)[], isFromMocap: boolean, animationGroup?: AnimationGroup) {
    super(undefined, animationGroup ? animationGroup.name : 'empty motion')
    this.model = model
    this.isInUse = false
    this.layers = [new PlaskLayer('Base Layer', targets, animationGroup ? animationGroup.targetedAnimations : [], true, isFromMocap)]
  }

  public clone() {
    
  }

  public use(scene: Scene) {
    if (!this.model.isVisualized) {
      this.model.visualize(scene)
    }
    
    if (this.isInUse) {
      console.error('Motion already in use')
    } else {
      this.isInUse = true
      console.log(this)
      // const animationGroup = this.toAnimationGroup()
    }
  }

  public toAnimationGroup() {

  }

  public addLayer() {

  }

  public getClassName() {
    return 'PlaskMotion'
  }
}
import { AnimationGroup } from "@babylonjs/core";
import PlaskEntity from "./PlaskEntity";

export default class PlaskMotion extends PlaskEntity {
  constructor(animationGroup: AnimationGroup) {
    super(undefined, animationGroup.name)
  }

  public clone() {
    
  }

  public toAnimationGroup() {

  }

  public getClassName() {
    return 'PlaskMotion'
  }
}
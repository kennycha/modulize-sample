import { IAnimationKey, Mesh, TransformNode } from "@babylonjs/core"
import { PlaskInterpolation, PlaskProperty } from "../../utils/types"
import PlaskLayer from "./PlaskLayer"

export default class PlaskTrack {
  public id: string
  public name: string
  public layer: PlaskLayer
  public property: PlaskProperty
  public target: TransformNode | Mesh
  public transformKeys: IAnimationKey[]
  public interpolation: PlaskInterpolation
  public filterBeta: number
  public filterMinCutoff: number
  
  constructor(layer: PlaskLayer, target: TransformNode | Mesh, property: PlaskProperty, transformKeys: IAnimationKey[], isFromMocap: boolean) {
    this.id = `${layer.id}//${target.id}//${property}`
    this.name = `${layer.name}|${target.name}|${property}`
    this.layer = layer
    this.property = property
    this.target = target
    this.transformKeys = transformKeys
    this.interpolation = 'linear'
    
    if (isFromMocap) {
      if (property === 'rotationQuaternion') {
        this.filterBeta = 0.3;
        this.filterMinCutoff = 3.0;
      } else {
        this.filterBeta = 0.002;
        this.filterMinCutoff = 0.05;
      }
    } else {
      this.filterBeta = 0.0
      this.filterMinCutoff = 1.0
    }
  }
}
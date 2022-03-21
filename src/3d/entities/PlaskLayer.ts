import { AbstractMesh, Quaternion, TargetedAnimation, TransformNode } from "@babylonjs/core"
import { v4 as uuid } from 'uuid';
import PlaskTrack from "./PlaskTrack"

export default class PlaskLayer {
  public id: string
  public name: string
  public isBase: boolean
  public isIncluded: boolean
  public usesFilter: boolean
  public tracks: PlaskTrack[]
  
  constructor(name: string, targets: (TransformNode | AbstractMesh)[], targetedAnimations: TargetedAnimation[], isBase: boolean, isFromMocap: boolean) {
    this.id = uuid()
    this.name = name
    this.isBase = isBase
    this.isIncluded = true
    this.usesFilter = false
    this.tracks = []

    targets.forEach((target) => {
      const positionTrack = new PlaskTrack(this, target, 'position', [], isFromMocap)
      const rotationTrack = new PlaskTrack(this, target, 'rotation', [], isFromMocap)
      const rotationQuaternionTrack = new PlaskTrack(this, target, 'rotationQuaternion', [], isFromMocap)
      const scalingTrack = new PlaskTrack(this, target, 'scaling', [], isFromMocap)

      targetedAnimations
        .filter((targetedAnimation) => targetedAnimation.target.id === target.id)
        .forEach(({ target: t, animation: a }) => {
          if (a.targetProperty === 'position') {
            positionTrack.transformKeys = a.getKeys().map((key) => ({ frame: Math.round(key.frame * 30), value: key.value }))
          } else if (a.targetProperty === 'rotationQuaternion') {
            const quaternionTransformKeys = a.getKeys().map((key) => ({ frame: Math.round(key.frame * 30), value: key.value }))

            rotationQuaternionTrack.transformKeys = quaternionTransformKeys
            rotationTrack.transformKeys = quaternionTransformKeys.map((key) => {
              const q  = key.value as Quaternion
              return ({ frame: Math.round(key.frame * 30), value: q.toEulerAngles() })
            })
          } else if (a.targetProperty === 'scaling') {
            scalingTrack.transformKeys = a.getKeys().map((key) => ({ frame: Math.round(key.frame * 30), value: key.value }))
          }
        })
      
      this.tracks.push(positionTrack)
      this.tracks.push(rotationTrack)
      this.tracks.push(rotationQuaternionTrack)
      this.tracks.push(scalingTrack)
    })
  }
}
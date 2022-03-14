import { ArcRotateCamera, Camera, Nullable, Vector3 } from "@babylonjs/core";
import { PlaskEngine } from "../PlaskEngine";
import Module from "./Module";

type PrevCameraProperties = {
  [key: string]: Nullable<Vector3>
}

type View = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right'

export default class CameraModule extends Module {
  private _prevPositions: PrevCameraProperties
  private _preTargets: PrevCameraProperties
  private _orthoView: View = 'front'

  constructor(plaskEngine: PlaskEngine) {
    super(plaskEngine)

    this._prevPositions = {}
    this._preTargets = {}
  }

  public initialize(): void {
    this.prevPositions[this.plaskEngine.canvas.id] = null
    this.prevTargets[this.plaskEngine.canvas.id] = null
  }

  public get prevPositions() {
    return this._prevPositions
  }

  public get prevTargets() {
    return this._preTargets
  }

  public toPerspective() {
    const activeCamera = this.plaskEngine.scene.activeCamera as Nullable<ArcRotateCamera>
    const canvasId = this.plaskEngine.canvas.id
    
    if (activeCamera && this.prevPositions && this.prevTargets && this.prevPositions[canvasId] && this.prevTargets[canvasId]) {
      activeCamera.mode = Camera.PERSPECTIVE_CAMERA

      activeCamera.setPosition(this.prevPositions[canvasId]!.clone())
      activeCamera.setTarget(this.prevTargets[canvasId]!.clone())
      this.prevPositions[canvasId] = null
      this.prevTargets[canvasId] = null
    }
  }

  public toOrthographic(view: View) {
    const activeCamera = this.plaskEngine.scene.activeCamera as Nullable<ArcRotateCamera>

    if (activeCamera) {
      const position = activeCamera.position.clone()
      const target = activeCamera.target.clone()
      let distance: number

      activeCamera.mode = Camera.ORTHOGRAPHIC_CAMERA
      const orthoFactor = 2
      const canvas = this.plaskEngine.canvas
      activeCamera.orthoTop = orthoFactor
      activeCamera.orthoBottom = -orthoFactor
      activeCamera.orthoLeft = -orthoFactor * (canvas.width / canvas.height)
      activeCamera.orthoRight = orthoFactor * (canvas.width / canvas.height)

      if (!this.prevPositions[canvas.id] && !this.prevTargets[canvas.id]) {
        this.prevPositions[canvas.id] = position
        this.prevTargets[canvas.id] = target
      }

      switch (view) {
        case 'top':
          this._orthoView = 'top'
          distance = Vector3.Distance(new Vector3(0, position.y, 0), new Vector3(0, target.y, 0));
          activeCamera.setPosition(new Vector3(target.x, distance + 10, target.z));
          break;
        case 'bottom':
          this._orthoView = 'bottom'
          distance = Vector3.Distance(new Vector3(0, position.y, 0), new Vector3(0, target.y, 0));
          activeCamera.setPosition(new Vector3(target.x, -(distance + 10), target.z));
          break;
        case 'front':
          this._orthoView = 'front'
          distance = Vector3.Distance(new Vector3(0, 0, position.z), new Vector3(0, 0, target.z));
          activeCamera.setPosition(new Vector3(target.x, target.y, distance + 10));
          break;
        case 'back':
          this._orthoView = 'back'
          distance = Vector3.Distance(new Vector3(0, 0, position.z), new Vector3(0, 0, target.z));
          activeCamera.setPosition(new Vector3(target.x, target.y, -(distance + 10)));
          break;
        case 'left':
          this._orthoView = 'left'
          distance = Vector3.Distance(new Vector3(position.x, 0, 0), new Vector3(target.x, 0, 0));
          activeCamera.setPosition(new Vector3(-(distance + 10), target.y, target.z));
          break;
        case 'right':
          this._orthoView = 'right'
          distance = Vector3.Distance(new Vector3(position.x, 0, 0), new Vector3(target.x, 0, 0));
          activeCamera.setPosition(new Vector3(distance + 10, target.y, target.z));
          break;
        default:
          break;
      }
    }
  }

  public goHome() {
    const activeCamera = this.plaskEngine.scene.activeCamera as Nullable<ArcRotateCamera>

    if (activeCamera) {
      const defaultPosition = new Vector3(0, 6, 10)
      const defaultTarget = Vector3.Zero()

      if (activeCamera.mode === Camera.ORTHOGRAPHIC_CAMERA) {
        const orthoFactor = 2
        const canvas = this.plaskEngine.canvas
        activeCamera.orthoTop = orthoFactor
        activeCamera.orthoBottom = -orthoFactor
        activeCamera.orthoLeft = -orthoFactor * (canvas.width / canvas.height)
        activeCamera.orthoRight = orthoFactor * (canvas.width / canvas.height)

        let distance: number
        
        switch (this._orthoView) {
          case 'top':
          this._orthoView = 'top'
          distance = Vector3.Distance(new Vector3(0, defaultPosition.y, 0), new Vector3(0, defaultTarget.y, 0));
          activeCamera.setPosition(new Vector3(defaultTarget.x, distance + 10, defaultTarget.z));
          break;
        case 'bottom':
          this._orthoView = 'bottom'
          distance = Vector3.Distance(new Vector3(0, defaultPosition.y, 0), new Vector3(0, defaultTarget.y, 0));
          activeCamera.setPosition(new Vector3(defaultTarget.x, -(distance + 10), defaultTarget.z));
          break;
        case 'front':
          this._orthoView = 'front'
          distance = Vector3.Distance(new Vector3(0, 0, defaultPosition.z), new Vector3(0, 0, defaultTarget.z));
          activeCamera.setPosition(new Vector3(defaultTarget.x, defaultTarget.y, distance + 10));
          break;
        case 'back':
          this._orthoView = 'back'
          distance = Vector3.Distance(new Vector3(0, 0, defaultPosition.z), new Vector3(0, 0, defaultTarget.z));
          activeCamera.setPosition(new Vector3(defaultTarget.x, defaultTarget.y, -(distance + 10)));
          break;
        case 'left':
          this._orthoView = 'left'
          distance = Vector3.Distance(new Vector3(defaultPosition.x, 0, 0), new Vector3(defaultTarget.x, 0, 0));
          activeCamera.setPosition(new Vector3(-(distance + 10), defaultTarget.y, defaultTarget.z));
          break;
        case 'right':
          this._orthoView = 'right'
          distance = Vector3.Distance(new Vector3(defaultPosition.x, 0, 0), new Vector3(defaultTarget.x, 0, 0));
          activeCamera.setPosition(new Vector3(distance + 10, defaultTarget.y, defaultTarget.z));
          break;
          default:
            break;
        }
        activeCamera.setTarget(defaultTarget);
      } else {
        activeCamera.setPosition(defaultPosition)
        activeCamera.setTarget(defaultTarget)
      }
    }
  }

  public dispose(): void {
    
  }
}
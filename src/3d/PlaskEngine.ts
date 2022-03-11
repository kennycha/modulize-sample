import { Animation, ArcRotateCamera, Camera, Color3, Color4, DirectionalLight, Engine, HemisphericLight, PointerEventTypes, PointerInfo, Scene } from "@babylonjs/core";
import { Dispatch } from "redux";
import { AnimationModule, AssetModule, CameraModule, GizmoModule, Module, SelectorModule } from "./modules";
import { createCamera, createDirectionalLight, createHemisphericLight, getUpdatedKeys } from "../utils";
import { RootState } from "../reducers";

export class PlaskEngine {
  // private attributes
  private _modules: Module[] = []
  private _engine!: Engine;
  private _scene!: Scene;
  private _canvas!: HTMLCanvasElement;
  private _camera!: ArcRotateCamera;
  private _hemiLight!: HemisphericLight;
  private _dirLight!: DirectionalLight; 

  // static attributes
  public static Instance: PlaskEngine
  
  // public attributes
  public state!: RootState
  public dispatch!: Dispatch<any>
  public animationModule!: AnimationModule
  public assetModule!: AssetModule
  public cameraModule!: CameraModule
  public gizmoModule!: GizmoModule
  public selectorModule!: SelectorModule

  constructor() {
    Animation.AllowMatricesInterpolation = true
    PlaskEngine.Instance = this
    this._registerModules();
  }

  // private methods
  private _registerModules() {
    this._modules.push(this.animationModule = new AnimationModule(this))
    this._modules.push(this.assetModule = new AssetModule(this))
    this._modules.push(this.cameraModule = new CameraModule(this))
    this._modules.push(this.gizmoModule = new GizmoModule(this))
    this._modules.push(this.selectorModule = new SelectorModule(this))
  }

  private _onSceneReady(scene: Scene) {
    scene.useRightHandedSystem = true
    scene.clearColor = Color4.FromColor3(Color3.FromHexString('#202020'))

    this._camera = createCamera(scene)
    this._hemiLight = createHemisphericLight(scene)
    this._dirLight = createDirectionalLight(scene)
  }

  private _onPointer(pointerInfo: PointerInfo, scene: Scene) {
    const { type } = pointerInfo
    if (type === PointerEventTypes.POINTERWHEEL) {
      const event = pointerInfo.event as WheelEvent & { wheelDelta: number }
      if (this.scene.activeCamera && this.scene.activeCamera.mode === Camera.ORTHOGRAPHIC_CAMERA) {
        const activeCamera = this.scene.activeCamera as ArcRotateCamera;
        const canvas = this.scene.getEngine().getRenderingCanvas();

        activeCamera.orthoTop! -= event.wheelDelta / 5000;
        activeCamera.orthoBottom! += event.wheelDelta / 5000;
        activeCamera.orthoLeft! += (event.wheelDelta / 5000) * (canvas!.width / canvas!.height);
        activeCamera.orthoRight! -= (event.wheelDelta / 5000) * (canvas!.width / canvas!.height);
      } 
    } else if (type === PointerEventTypes.POINTERDOWN) {
      const event = pointerInfo.event as PointerEvent;
      // return to perspective mode when camera is rotated
      if (event.button === 0 && event.altKey && this.scene.activeCamera && this.scene.activeCamera.mode === Camera.ORTHOGRAPHIC_CAMERA) {
        // this.cameraModule.toPerspective();
      }
    }
  }

  private _registerObservables(scene: Scene) {
    scene.onPointerObservable.add((pointerInfo) => {
      this._onPointer(pointerInfo, scene)
    })
  }

  // static methods
  public static GetInstance() {
    return PlaskEngine.Instance;
  }

  // public methods
  public initialize(canvas: HTMLCanvasElement, dispatch: Dispatch<any>) {
    console.log('Initializing plask engine...')
    this._canvas = canvas
    this._engine = new Engine(canvas)
    this._scene = new Scene(this._engine)
    this.scene.onReadyObservable.addOnce((scene) => {
      this._onSceneReady(scene)
      this._registerObservables(scene)
    })
    this.dispatch = dispatch

    this._modules.forEach((module) => {
      module.initialize()
    })

    this._engine.runRenderLoop(() => {
      this._scene.render();
    })
  }

  public onStateChanged(action: any, state: any, prevState: any) {
    this.state = state

    this._modules.forEach((module) => {
      module.reduxObservedStateKeys.forEach((stateKey) => {
        const updatedKeys = getUpdatedKeys(state[stateKey], prevState[stateKey])
        if (updatedKeys.length > 0) {
          updatedKeys.forEach((key) => {
            module.onStateChanged(stateKey, key)
          })
        }
      })
    })
  }

  public changeSceneClearColor(theme: 'light' | 'dark') {
    if (this._scene) {
      if (theme === 'dark') {
        this._scene.clearColor = Color4.FromColor3(Color3.FromHexString('#808080'))
      } else {
        this._scene.clearColor = Color4.FromColor3(Color3.FromHexString('#202020'))
      }
    }
  }
  
  public dispose() {
    this._engine.dispose()
    this._scene.dispose()

    this._modules.forEach((module) => {
      module.dispose()
    })
    this._modules = []
  }

  // getters
  public get scene() {
    return this._scene
  }

  public get canvas() {
    return this._canvas
  }

  public get modules() {
    return this._modules
  }
}
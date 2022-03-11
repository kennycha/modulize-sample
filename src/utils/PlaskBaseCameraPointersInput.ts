import { Camera, EventState, ICameraInput, Nullable, Observer, PointerEventTypes, PointerInfo, PointerTouch, Tools } from '@babylonjs/core';
import { IPointerEvent } from './types';

/**
 * customized pointer input class for base camera
 *
 * Base class for Camera Pointer Inputs.
 * See FollowCameraPointersInput in src/Cameras/Inputs/followCameraPointersInput.ts
 * for example usage.
 */
export default abstract class PlaskBaseCameraPointersInput implements ICameraInput<Camera> {
  /**
   * Defines the camera the input is attached to.
   */
  public abstract camera: Camera;

  /**
   * Whether keyboard modifier keys are pressed at time of last mouse event.
   */
  //@ts-ignore
  protected _altKey: boolean;
  //@ts-ignore
  protected _ctrlKey: boolean;
  //@ts-ignore
  protected _metaKey: boolean;
  //@ts-ignore
  protected _shiftKey: boolean;

  /**
   * Which mouse buttons were pressed at time of last mouse event.
   * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
   */
  //@ts-ignore
  protected _buttonsPressed: number;

  private _currentActiveButton: number = -1;

  /**
   * Defines the buttons associated with the input to handle camera move.
   */
  public buttons = [0, 1, 2];

  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param element Defines the element the controls should be listened from
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  public attachControl(noPreventDefault?: boolean): void {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    var engine = this.camera.getEngine();
    const element = engine.getInputElement();
    var previousPinchSquaredDistance = 0;
    var previousMultiTouchPanPosition: Nullable<PointerTouch> = null;

    this.pointA = null;
    this.pointB = null;

    this._altKey = false;
    this._ctrlKey = false;
    this._metaKey = false;
    this._shiftKey = false;
    this._buttonsPressed = 0;

    this._pointerInput = (p, s) => {
      var evt = p.event as unknown as IPointerEvent;
      let isTouch = evt.pointerType === 'touch';

      if (engine.isInVRExclusivePointerMode) {
        return;
      }

      if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
        return;
      }

      let srcElement = (evt.srcElement || evt.target) as HTMLElement;

      this._altKey = evt.altKey;
      this._ctrlKey = evt.ctrlKey;
      this._metaKey = evt.metaKey;
      this._shiftKey = evt.shiftKey;
      this._buttonsPressed = evt.buttons;

      if (engine.isPointerLock) {
        const offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
        const offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;

        this.onTouch(null, offsetX, offsetY);
        this.pointA = null;
        this.pointB = null;
      } else if (p.type === PointerEventTypes.POINTERDOWN && srcElement && this._altKey) {
        try {
          srcElement.setPointerCapture(evt.pointerId);
        } catch (e) {
          //Nothing to do with the error. Execution will continue.
        }

        if (this.pointA === null) {
          this.pointA = {
            x: evt.clientX,
            y: evt.clientY,
            pointerId: evt.pointerId,
            type: evt.pointerType,
          };
        } else if (this.pointB === null) {
          this.pointB = {
            x: evt.clientX,
            y: evt.clientY,
            pointerId: evt.pointerId,
            type: evt.pointerType,
          };
        }

        if (this._currentActiveButton === -1 && !isTouch) {
          this._currentActiveButton = evt.button;
        }
        this.onButtonDown(evt);

        if (!noPreventDefault) {
          evt.preventDefault();
          element && element.focus();
        }
      } else if (p.type === PointerEventTypes.POINTERDOUBLETAP) {
        this.onDoubleTap(evt.pointerType);
      } else if (p.type === PointerEventTypes.POINTERUP && srcElement) {
        try {
          srcElement.releasePointerCapture(evt.pointerId);
        } catch (e) {
          //Nothing to do with the error.
        }

        if (!isTouch) {
          this.pointB = null; // Mouse and pen are mono pointer
        }

        //would be better to use pointers.remove(evt.pointerId) for multitouch gestures,
        //but emptying completely pointers collection is required to fix a bug on iPhone :
        //when changing orientation while pinching camera,
        //one pointer stay pressed forever if we don't release all pointers
        //will be ok to put back pointers.remove(evt.pointerId); when iPhone bug corrected
        if (engine._badOS) {
          this.pointA = this.pointB = null;
        } else {
          //only remove the impacted pointer in case of multitouch allowing on most
          //platforms switching from rotate to zoom and pan seamlessly.
          if (this.pointB && this.pointA && this.pointA.pointerId === evt.pointerId) {
            this.pointA = this.pointB;
            this.pointB = null;
          } else if (this.pointA && this.pointB && this.pointB.pointerId === evt.pointerId) {
            this.pointB = null;
          } else {
            this.pointA = this.pointB = null;
          }
        }

        if (previousPinchSquaredDistance !== 0 || previousMultiTouchPanPosition) {
          // Previous pinch data is populated but a button has been lifted
          // so pinch has ended.
          this.onMultiTouch(
            this.pointA,
            this.pointB,
            previousPinchSquaredDistance,
            0, // pinchSquaredDistance
            previousMultiTouchPanPosition,
            null, // multiTouchPanPosition
          );
          previousPinchSquaredDistance = 0;
          previousMultiTouchPanPosition = null;
        }

        this._currentActiveButton = -1;
        this.onButtonUp(evt);

        if (!noPreventDefault) {
          evt.preventDefault();
        }
      } else if (p.type === PointerEventTypes.POINTERMOVE) {
        if (!noPreventDefault) {
          evt.preventDefault();
        }

        // One button down
        if (this.pointA && this.pointB === null) {
          const offsetX = evt.clientX - this.pointA.x;
          const offsetY = evt.clientY - this.pointA.y;
          this.onTouch(this.pointA, offsetX, offsetY);

          this.pointA.x = evt.clientX;
          this.pointA.y = evt.clientY;
        }
        // Two buttons down: pinch
        else if (this.pointA && this.pointB) {
          var ed = this.pointA.pointerId === evt.pointerId ? this.pointA : this.pointB;
          ed.x = evt.clientX;
          ed.y = evt.clientY;
          var distX = this.pointA.x - this.pointB.x;
          var distY = this.pointA.y - this.pointB.y;
          var pinchSquaredDistance = distX * distX + distY * distY;
          var multiTouchPanPosition = {
            x: (this.pointA.x + this.pointB.x) / 2,
            y: (this.pointA.y + this.pointB.y) / 2,
            pointerId: evt.pointerId,
            type: p.type,
          };

          this.onMultiTouch(this.pointA, this.pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition);

          previousMultiTouchPanPosition = multiTouchPanPosition;
          previousPinchSquaredDistance = pinchSquaredDistance;
        }
      }
    };

    this._observer = this.camera
      .getScene()
      .onPointerObservable.add(
        this._pointerInput,
        PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE | PointerEventTypes.POINTERDOUBLETAP,
      );

    this._onLostFocus = () => {
      this.pointA = this.pointB = null;
      previousPinchSquaredDistance = 0;
      previousMultiTouchPanPosition = null;
      this.onLostFocus();
    };

    element && element.addEventListener('contextmenu', this.onContextMenu.bind(this) as EventListener, false);

    let hostWindow = this.camera.getScene().getEngine().getHostWindow();

    if (hostWindow) {
      Tools.RegisterTopRootEvents(hostWindow, [{ name: 'blur', handler: this._onLostFocus }]);
    }
  }

  /**
   * Detach the current controls from the specified dom element.
   */
  public detachControl(): void;

  /**
   * Detach the current controls from the specified dom element.
   * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
   */
  public detachControl(ignored?: any): void {
    if (this._onLostFocus) {
      let hostWindow = this.camera.getScene().getEngine().getHostWindow();
      if (hostWindow) {
        Tools.UnregisterTopRootEvents(hostWindow, [{ name: 'blur', handler: this._onLostFocus }]);
      }
    }

    if (this._observer) {
      this.camera.getScene().onPointerObservable.remove(this._observer);
      this._observer = null;

      if (this.onContextMenu) {
        const inputElement = this.camera.getScene().getEngine().getInputElement();
        inputElement && inputElement.removeEventListener('contextmenu', this.onContextMenu as EventListener);
      }

      this._onLostFocus = null;
    }

    this._altKey = false;
    this._ctrlKey = false;
    this._metaKey = false;
    this._shiftKey = false;
    this._buttonsPressed = 0;
  }

  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  public getClassName(): string {
    return 'PlaskBaseCameraPointersInput';
  }

  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  public getSimpleName(): string {
    return 'pointers';
  }

  /**
   * Called on pointer POINTERDOUBLETAP event.
   * Override this method to provide functionality on POINTERDOUBLETAP event.
   */
  protected onDoubleTap(type: string) {}

  /**
   * Called on pointer POINTERMOVE event if only a single touch is active.
   * Override this method to provide functionality.
   */
  protected onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void {}

  /**
   * Called on pointer POINTERMOVE event if multiple touches are active.
   * Override this method to provide functionality.
   */
  protected onMultiTouch(
    pointA: Nullable<PointerTouch>,
    pointB: Nullable<PointerTouch>,
    previousPinchSquaredDistance: number,
    pinchSquaredDistance: number,
    previousMultiTouchPanPosition: Nullable<PointerTouch>,
    multiTouchPanPosition: Nullable<PointerTouch>,
  ): void {}

  /**
   * Called on JS contextmenu event.
   * Override this method to provide functionality.
   */
  protected onContextMenu(evt: PointerEvent): void {
    evt.preventDefault();
  }

  /**
   * Called each time a new POINTERDOWN event occurs. Ie, for each button
   * press.
   * Override this method to provide functionality.
   */
  protected onButtonDown(evt: IPointerEvent): void {}

  /**
   * Called each time a new POINTERUP event occurs. Ie, for each button
   * release.
   * Override this method to provide functionality.
   */
  protected onButtonUp(evt: IPointerEvent): void {}

  /**
   * Called when window becomes inactive.
   * Override this method to provide functionality.
   */
  protected onLostFocus(): void {}

  //@ts-ignore
  private _pointerInput: (p: PointerInfo, s: EventState) => void;
  //@ts-ignore
  private _observer: Nullable<Observer<PointerInfo>>;
  //@ts-ignore
  private _onLostFocus: Nullable<(e: FocusEvent) => any>;
  //@ts-ignore
  private pointA: Nullable<PointerTouch>;
  //@ts-ignore
  private pointB: Nullable<PointerTouch>;
}

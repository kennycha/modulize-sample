import { ArcRotateCamera, Scene, Vector3 } from '@babylonjs/core';
import PlaskArcRotateCameraPointersInput from './PlaskArcRotateCameraPointersInput';

const DEFAULT_CAMERA_POSITION_ARRAY = [0, 6, 10];

const createCamera = (scene: Scene, initialPosition?: Vector3) => {
  const arcRotateCamera = new ArcRotateCamera('arcRotateCamera', 0, 6, 10, Vector3.Zero(), scene);
  arcRotateCamera.setPosition((initialPosition = Vector3.FromArray(DEFAULT_CAMERA_POSITION_ARRAY)));
  arcRotateCamera.attachControl(scene.getEngine().getRenderingCanvas(), false);
  arcRotateCamera.allowUpsideDown = false;
  arcRotateCamera.minZ = 0.1;
  arcRotateCamera.inertia = 0.5;
  arcRotateCamera.wheelPrecision = 50;
  arcRotateCamera.wheelDeltaPercentage = 0.05;
  arcRotateCamera.lowerRadiusLimit = 0.1;
  arcRotateCamera.upperRadiusLimit = 100;
  arcRotateCamera.pinchPrecision = 50;
  arcRotateCamera.panningAxis = new Vector3(1, 1, 0);
  arcRotateCamera.panningInertia = 0.5;
  arcRotateCamera.panningDistanceLimit = 100;

  arcRotateCamera.inputs.remove(arcRotateCamera.inputs.attached.pointers);
  arcRotateCamera.inputs.add(new PlaskArcRotateCameraPointersInput());

  return arcRotateCamera;
};

export default createCamera;

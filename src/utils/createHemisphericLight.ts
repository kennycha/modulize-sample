import { HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

const defaultReflectionDirectionArray = [0, 1, 1];

const createHemisphericLight = (scene: Scene, reflectionDirection?: Vector3) => {
  const hemisphericLight = new HemisphericLight('hemisphericLight', (reflectionDirection = Vector3.FromArray(defaultReflectionDirectionArray)), scene);
  hemisphericLight.intensity = 0.9;

  return hemisphericLight;
};

export default createHemisphericLight;

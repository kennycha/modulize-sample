import { DirectionalLight, Scene, Vector3 } from "@babylonjs/core";

const defaultPositionArray = [0, 10, 10];
const defaultDirectionArray = [0, 1, 0];

const createDirectionalLight = (scene: Scene, position?: Vector3, direction?: Vector3) => {
  const directionalLight = new DirectionalLight('directionalLight', (direction = Vector3.FromArray(defaultPositionArray)), scene);
  directionalLight.position = position ?? Vector3.FromArray(defaultDirectionArray);
  directionalLight.intensity = 0.1;

  return directionalLight;
};

export default createDirectionalLight;

import { ActionManager, Bone, ExecuteCodeAction, Matrix, Mesh, MeshBuilder, Nullable, Scene, Vector3, VertexBuffer } from '@babylonjs/core';

const getAbsoluteBindPoseToRef = (bone: Nullable<Bone>, matrix: Matrix) => {
  if (bone === null || bone.getIndex() === -1) {
    matrix.copyFrom(Matrix.Identity());
    return;
  }
  getAbsoluteBindPoseToRef(bone.getParent(), matrix);
  bone.getBaseMatrix().multiplyToRef(matrix, matrix);
  return;
};

const addJointSpheres = (bones: Bone[], scene: Scene, assetId: string) => {
  const sphereBoneGroups: Array<[Mesh, Bone]> = [];
  let longestBoneLength = Number.NEGATIVE_INFINITY;

  bones.forEach((bone, idx) => {
    const boneAbsoluteBindPoseTransform = new Matrix();
    getAbsoluteBindPoseToRef(bone, boneAbsoluteBindPoseTransform);
    const anchorPoint = new Vector3();
    boneAbsoluteBindPoseTransform.decompose(undefined, undefined, anchorPoint);
    bone.children.forEach((child, childIndex) => {
      const childAbsoluteBindPoseTransform = new Matrix();
      child.getBaseMatrix().multiplyToRef(boneAbsoluteBindPoseTransform, childAbsoluteBindPoseTransform);
      const childPoint = new Vector3();
      childAbsoluteBindPoseTransform.decompose(undefined, undefined, childPoint);
      const distanceFromParent = Vector3.Distance(anchorPoint, childPoint);
      if (distanceFromParent > longestBoneLength) {
        longestBoneLength = distanceFromParent;
      }
    });
    const sphereBaseSize = 0.4;
    const sphere = MeshBuilder.CreateSphere(`${bone.name}_joint`, { segments: 20, diameter: sphereBaseSize, updatable: true }, scene);
    sphere.id = `${assetId}//${bone.name}//joint`;
    sphere.renderingGroupId = 2;

    const numVertices = sphere.getTotalVertices();
    const mwk = [];
    const mik = [];
    for (let i = 0; i < numVertices; i += 1) {
      mwk.push(1, 0, 0, 0);
      mik.push(bone.getIndex(), 0, 0, 0);
    }
    sphere.setVerticesData(VertexBuffer.MatricesWeightsKind, mwk, false);
    sphere.setVerticesData(VertexBuffer.MatricesIndicesKind, mik, false);
    sphere.position = anchorPoint.clone();
    sphereBoneGroups.push([sphere, bone]);
  });

  const sphereScaleUnit = 15;

  sphereBoneGroups.forEach(([sphere, bone]) => {
    const scale = 1 / (sphereScaleUnit / longestBoneLength);
    sphere.scaling.scaleInPlace(scale);

    sphere.actionManager = new ActionManager(scene);
    sphere.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
        scene.hoverCursor = 'pointer';
      }),
    );

    scene.onBeforeRenderObservable.add(() => {
      sphere.setAbsolutePosition(bone.getAbsolutePosition());
    });
  });

  return sphereBoneGroups;
};

export default addJointSpheres;

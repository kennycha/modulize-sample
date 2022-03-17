import { Bone, Matrix, Nullable } from "@babylonjs/core";

const getAbsoluteBindPoseToRef = (bone: Nullable<Bone>, matrix: Matrix) => {
  if (bone === null || bone.getIndex() === -1) {
    matrix.copyFrom(Matrix.Identity());
    return;
  }
  getAbsoluteBindPoseToRef(bone.getParent(), matrix);
  bone.getBaseMatrix().multiplyToRef(matrix, matrix);
  return;
};

export default getAbsoluteBindPoseToRef;

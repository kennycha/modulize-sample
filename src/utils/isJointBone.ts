import { Bone } from "@babylonjs/core";

const isJointBone = (bone: Bone) => {
  if (
    bone.name.toLowerCase().includes('scene') ||
    bone.name.toLowerCase().includes('camera') ||
    bone.name.toLowerCase().includes('light') || 
    bone.name.toLowerCase().includes('__root__')) {
    return false
  } else {
    return true
  }
}

export default isJointBone
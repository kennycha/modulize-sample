import { ActionEvent, ActionManager, Bone, ExecuteCodeAction, Matrix, Mesh, MeshBuilder, Nullable, Scene, SkeletonViewer, Vector3, VertexBuffer } from "@babylonjs/core";
import { getAbsoluteBindPoseToRef } from "../../utils";
import isJointBone from "../../utils/isJointBone";
import { Extension } from "../../utils/types";
import PlaskModel from "./PlaskModel";

const DEFAULT_SKELETON_VIEWER_OPTION = {
  pauseAnimations: false,
  returnToRest: false,
  computeBonesUsingShaders: true,
  useAllBones: true,
  displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS,
  displayOptions: {
    sphereBaseSize: 0.01,
    sphereScaleUnit: 15,
    sphereFactor: 0.9,
    midStep: 0.25,
    midStepFactor: 0.05,
  },
}

export default class PlaskSkeletalModel extends PlaskModel {
  private _skeletonViewer: Nullable<SkeletonViewer>
  private _joints: Mesh[]

  constructor(name: string, extension: Extension, fileUrl: string) {
    super(name, extension, fileUrl)

    this._joints = []
    this._skeletonViewer = null
  }

  private _addJoints(bones: Bone[], scene: Scene, modelId: string) {
    const jointBoneGroups: Array<[Mesh, Bone]> = [];
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
      const joint = MeshBuilder.CreateSphere(`${bone.name}_joint`, { segments: 20, diameter: sphereBaseSize, updatable: true }, scene);
      joint.id = `${modelId}//${bone.name}//joint`;
      joint.renderingGroupId = 2;
  
      const numVertices = joint.getTotalVertices();
      const mwk = [];
      const mik = [];
      for (let i = 0; i < numVertices; i += 1) {
        mwk.push(1, 0, 0, 0);
        mik.push(bone.getIndex(), 0, 0, 0);
      }
      joint.setVerticesData(VertexBuffer.MatricesWeightsKind, mwk, false);
      joint.setVerticesData(VertexBuffer.MatricesIndicesKind, mik, false);
      joint.position = anchorPoint.clone();
      jointBoneGroups.push([joint, bone]);
    });
  
    const sphereScaleUnit = 15;
  
    jointBoneGroups.forEach(([joint, bone]) => {
      const scale = 1 / (sphereScaleUnit / longestBoneLength);
      joint.scaling.scaleInPlace(scale);
  
      joint.actionManager = new ActionManager(scene);
      joint.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          scene.hoverCursor = 'pointer';
        }),
      );
  
      scene.onBeforeRenderObservable.add(() => {
        joint.setAbsolutePosition(bone.getAbsolutePosition());
      });
    });
  
    return jointBoneGroups;
  }

  public async visualize(scene: Scene) {
    await super.visualize(scene)

    if (this.assetContainer) {
      const { meshes, skeletons } = this.assetContainer

      scene.addSkeleton(skeletons[0])
      skeletons[0]!.bones.filter(isJointBone).forEach((bone) => {
        bone.id = `${this.id}//${bone.name}//bone`

        const transformNode = bone.getTransformNode()
        if (transformNode) {
          transformNode.id = `${this.id}//${bone.name}//transformNode`
          scene.addTransformNode(transformNode)
        }
      })

      const jointBoneGroups = this._addJoints(skeletons[0].bones.filter(isJointBone), scene, this.id)
      jointBoneGroups.forEach(([joint, bone]) => {
        joint.actionManager!.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (event: ActionEvent) => {
            const targetTransformNode = bone.getTransformNode();
            if (targetTransformNode) {
              const sourceEvent: PointerEvent = event.sourceEvent;
              if (sourceEvent.ctrlKey || sourceEvent.metaKey) {
                console.log('xor select, target: ', targetTransformNode)
              } else {
                console.log('default select, target: ', targetTransformNode)
              }
            }
          })
        )
      })
      
      this._joints = jointBoneGroups.map((group) => group[0])
      this._skeletonViewer = new SkeletonViewer(skeletons[0], meshes[0], scene, true, meshes[0].renderingGroupId, DEFAULT_SKELETON_VIEWER_OPTION)
    }
  }

  public unvisualize(scene: Scene) {
    if (this._skeletonViewer) {
      this._skeletonViewer.dispose()
    }
    this._joints.forEach((joint) => {
      joint.dispose()
    })

    super.unvisualize(scene)
  }

  public getClassName() {    
    return 'PlaskSkeletalModel'
  }
}
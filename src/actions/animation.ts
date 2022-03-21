import { AnimationGroup } from "@babylonjs/core"

export type AnimationAction = 
  | ReturnType<typeof setAnimationGroup>
  | ReturnType<typeof setLoopRange>
  | ReturnType<typeof playForward>
  | ReturnType<typeof playBackward>
  | ReturnType<typeof pause>
  | ReturnType<typeof stop>

export const SET_ANIMATION_GROUP = 'animation/SET_ANIMATION_GROUP' as const
interface SetAnimationGroup {
  animationGroup: AnimationGroup
}
export const setAnimationGroup = (params: SetAnimationGroup) => ({
  type: SET_ANIMATION_GROUP,
  payload: params
})

export const SET_LOOP_RANGE = 'animation/SET_LOOP_RANGE' as const
interface SetLoopRange {
  from: number
  to: number
}
export const setLoopRange = (params: SetLoopRange) => ({
  type: SET_LOOP_RANGE,
  payload: params
})

export const PLAY_FORWARD = 'animation/PLAY_FORWARD' as const
export const playForward = () => ({
  type: PLAY_FORWARD,
})

export const PLAY_BACKWARD = 'animation/PLAY_BACKWARD' as const
export const playBackward = () => ({
  type: PLAY_BACKWARD,
})

export const PAUSE = 'animation/PAUSE' as const
export const pause = () => ({
  type: PAUSE,
})

export const STOP = 'animation/STOP' as const
export const stop = () => ({
  type: STOP,
})
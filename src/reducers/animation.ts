import { AnimationGroup, Nullable } from "@babylonjs/core";
import { AnimationAction } from "../actions/animation";
import { PlaskPlayDirection, PlaskPlayState } from "../utils/types";


interface AnimationState {
  currentAnimationGroup: Nullable<AnimationGroup>
  playState: PlaskPlayState
  playDirection: PlaskPlayDirection
  playSpeed: number
  currentIndex: number
  startIndex: number
  endIndex: number
}

const defaultState: AnimationState = {
  currentAnimationGroup: null,
  playState: 'stop',
  playDirection: PlaskPlayDirection.forward,
  playSpeed: 1,
  currentIndex: 0,
  startIndex: 0,
  endIndex: 100,
}

export const animation = (state = defaultState, action: AnimationAction) => {
  switch (action.type) {
    case 'animation/SET_ANIMATION_GROUP': {
      return Object.assign({}, state, {
        currentAnimationGroup: action.payload.animationGroup
      })
    }
    case 'animation/SET_LOOP_RANGE': {
      return Object.assign({}, state, {
        startIndex: action.payload.from,
        endIndex: action.payload.to
      })
    }
    case 'animation/PLAY_FORWARD': {
      return Object.assign({}, state, {
        playState: 'play',
        playDirection: PlaskPlayDirection.forward
      })
    }
    case 'animation/PLAY_BACKWARD': {
      return Object.assign({}, state, {
        playState: 'play',
        playDirection: PlaskPlayDirection.backward
      })
    }
    case 'animation/PAUSE': {
      return Object.assign({}, state, {
        playState: 'pause'
      })
    }
    case 'animation/STOP': {
      return Object.assign({}, state, {
        playState: 'stop'
      })
    }
    default: {
      return state
    }
  }
}
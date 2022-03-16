import { PlaskMocap, PlaskModel, PlaskMotion, PlaskSkeletalModel } from "../3d/entities";
import { AssetsAction } from "../actions/assets";

interface AssetsState {
  models: (PlaskModel | PlaskSkeletalModel)[];
  motions: PlaskMotion[];
  mocaps: PlaskMocap[];
}

const defaultState: AssetsState = {
  models: [],
  motions: [],
  mocaps: [],
}

export const assets = (state = defaultState, action: AssetsAction) => {
  switch (action.type) {
    case 'assets/ADD_MODEL': {
      return Object.assign({}, state, {
        models: [...state.models, action.payload.model]
      })
    }
    default: {
      return state
    }
  }
}
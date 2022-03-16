import { PlaskModel, PlaskSkeletalModel } from "../3d/entities"

export type AssetsAction = ReturnType<typeof addModel>

export const ADD_MODEL = 'assets/ADD_MODEL' as const

interface AddModel {
  model: PlaskModel | PlaskSkeletalModel
}
export const addModel = (params: AddModel) => ({
  type: ADD_MODEL,
  payload: params,
})
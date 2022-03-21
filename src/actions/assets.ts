import { PlaskModel, PlaskMotion, PlaskSkeletalModel } from "../3d/entities"

export type AssetsAction = ReturnType<typeof importFile>

export const IMPORT_FILE = 'assets/IMPORT_FILE' as const
interface ImportFile {
  model: PlaskModel | PlaskSkeletalModel;
  motions: PlaskMotion[]
}
export const importFile = (params: ImportFile) => ({
  type: IMPORT_FILE,
  payload: params,
})
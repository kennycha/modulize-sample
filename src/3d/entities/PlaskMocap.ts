import PlaskEntity from "./PlaskEntity";

export default class PlaskMocap extends PlaskEntity {
  constructor(name: string) {
    super(undefined, name)
  }

  public toMotion() {
    
  }
  
  public getClassName() {
    return 'PlaskMocap'
  }
}
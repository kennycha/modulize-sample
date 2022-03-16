import { v4 as uuid } from 'uuid';

export default abstract class PlaskEntity {
  public id: string
  public name: string
  
  constructor(id?: string, name?: string) {
    this.id = id ? id : uuid()
    this.name = name ? name : 'GenericEntity'
  }
}
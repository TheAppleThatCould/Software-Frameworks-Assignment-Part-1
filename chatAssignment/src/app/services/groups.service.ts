import { Injectable } from '@angular/core';

export interface GroupData {
  id: number;
  name: string;
  userID: number[];
  adminID: number;
  assistantID: number[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor() { }
}

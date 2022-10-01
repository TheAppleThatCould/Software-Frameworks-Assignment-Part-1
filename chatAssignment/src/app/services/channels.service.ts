import { Injectable } from '@angular/core';

// Reduce redundent code by having the channelData interface in one spot.
export interface ChannelData {
  id: number;
  name: string;
  groupID: number;
  userID: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  constructor() { }
}

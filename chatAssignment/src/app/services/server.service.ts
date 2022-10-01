import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";

// Reduce redundency by exporting the httpOtions and backend url.
export const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};
export const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
// A service for the server related code. 
export class ServerService {

  constructor() { }
}

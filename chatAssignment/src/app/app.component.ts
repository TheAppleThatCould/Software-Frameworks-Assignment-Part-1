import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatAssignment';

  constructor(private router: Router){}

  public logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
}

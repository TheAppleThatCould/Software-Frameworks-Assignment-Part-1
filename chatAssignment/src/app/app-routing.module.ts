import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { AccountComponent } from './account/account.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "account", component: AccountComponent},
  {path: "chatArea", component: ChatAreaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

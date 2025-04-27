import { Routes } from "@angular/router";
import { LoginpageComponent } from "./login/loginpage/loginpage.component";
import { AppComponent } from "./app.component";

export const routes: Routes = [
    { path: 'login', component: LoginpageComponent },
    { path: '', component: AppComponent }
]
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from "./home/home.component";
@Component({
  selector: 'app-root',
  standalone:true,
  imports:[RouterModule,
    MatToolbarModule,
    HeaderComponent,
    HomeComponent,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_web';
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports:[RouterModule,
    MatToolbarModule,
    HeaderComponent,
    HomeComponent,
    CommonModule],  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

}

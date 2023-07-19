import { Component } from '@angular/core';
import Users from './Users';
@Component({
  standalone:true,
  imports: [Users],
  selector: 'app-banner',
  templateUrl:"./banner.html",
  styleUrls: ['./banner.css'],
})
export default class Banner{}

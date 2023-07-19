import { Component } from '@angular/core';
import Plugins from './plugins'
import Banner from './Banner'
import Navigation from './Navigation';
import Parts from "./Parts";
@Component({
  standalone:true,
  imports: [Banner,Navigation,...Parts],
  selector: 'app-root',
  templateUrl:"./app.html",
  styleUrls: ['./app.css'],
})
export default class Home {
  ngOnInit(){
    Plugins()
  }
}

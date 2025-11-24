import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { RouterOutlet } from '@angular/router';
import { Upcoming } from './components/upcoming/upcoming';

@Component({
  selector: 'app-home-page',
  imports: [Hero, RouterOutlet, Upcoming],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage {}

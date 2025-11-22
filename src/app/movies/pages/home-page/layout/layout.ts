import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from '../components/hero/hero';
import { Upcoming } from '../components/upcoming/upcoming';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Hero, Upcoming],
  templateUrl: './layout.html',
  styles: ``,
})
export class Layout {}

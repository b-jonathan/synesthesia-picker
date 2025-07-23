import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
})
export class App {}

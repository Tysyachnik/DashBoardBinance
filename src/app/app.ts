import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PairsTable } from './components/pairs-table/pairs-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PairsTable],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('DashBoardBinance');
}

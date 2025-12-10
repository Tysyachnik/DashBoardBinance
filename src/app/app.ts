import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less',
<<<<<<< HEAD
=======
  changeDetection: ChangeDetectionStrategy.OnPush,
>>>>>>> pr-branch-2
})
export class App {
  protected readonly title = signal('DashBoardBinance');
}

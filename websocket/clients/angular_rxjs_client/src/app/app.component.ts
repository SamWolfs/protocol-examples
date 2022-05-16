import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_rxjs_client';

  constructor(private appService: AppService) {
    setTimeout(() => this.appService.echo("Hello World!"), 2000);
  }
}

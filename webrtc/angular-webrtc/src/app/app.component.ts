import { Component } from '@angular/core';
import { WebRTCService } from './webrtc/webrtc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-webrtc';

  constructor(private webrtc: WebRTCService) {}
}

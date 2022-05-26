import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Envelope } from '../../proto/webrtc.api';

@Injectable({
    providedIn: 'root',
})
export class SignalService {
    private websocket: WebSocketSubject<any>;
    private sdp = new Subject<string>();
    sdp$ = this.sdp.asObservable();

    constructor() {
        this.websocket = webSocket({
            url: 'ws://localhost:8080/ws',
            binaryType: "arraybuffer",
            serializer: msg => Envelope.encode(msg).finish(),
            deserializer: ({ data }) => this.deserializeCommand(data)
        });

        this.websocket.subscribe({
            next: (msg: Envelope) => this.handle(msg), // Called whenever there is a message from the server.
            error: (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
        });
    }

    sendOffer(sdp: string) {
        const envelope: Envelope = {
            sdpOffer: {
                sdp: sdp
            },
            sdpAnswer: undefined
        }
        this.websocket.next(envelope);
    }

    deserializeCommand(buffer: ArrayBuffer) {
        const binBuffer = new Uint8Array(buffer);
        return Envelope.decode(binBuffer);
    }

    handle(msg: Envelope) {
        if (msg.sdpAnswer !== undefined) {
            this.sdp.next(msg.sdpAnswer.sdp);
        }
    }
}

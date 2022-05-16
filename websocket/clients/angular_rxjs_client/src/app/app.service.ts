import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Command } from '../proto/command';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    private websocket: WebSocketSubject<any>;

    constructor() {
        this.websocket = webSocket({
            url: 'ws://localhost:8080',
            binaryType: "arraybuffer",
            serializer: msg => Command.encode(msg).finish(),
            deserializer: ({ data }) => this.deserializeCommand(data)
        });

        this.websocket.subscribe({
            next: (msg: Command) => console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
            error: (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
        });
    }

    echo(message: string) {
        const command: Command = {
            echo: {
                msg: message
            },
            increment: undefined
        }
        this.websocket.next(command);
    }

    deserializeCommand(buffer: ArrayBuffer) {
        const binBuffer = new Uint8Array(buffer);
        return Command.decode(binBuffer);
    }
}

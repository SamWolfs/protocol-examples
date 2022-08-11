import { Injectable } from '@angular/core';
import { SignalService } from './signal.service';

const WEBRTC_CONFIG: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

const MEDIA_CONFIG = {
    audio: true
}

@Injectable({
    providedIn: 'root',
})
export class WebRTCService {
    peerConnection: RTCPeerConnection;

    constructor(private signal: SignalService) {
        this.peerConnection = new RTCPeerConnection(WEBRTC_CONFIG);
        this.initUserMedia();
        this.initHandlers();
        this.signal.sdp$.subscribe(sdp => {
            this.peerConnection.setRemoteDescription({ sdp, type: 'answer' });
        });
    }

    initUserMedia() {
        navigator.mediaDevices
            .getUserMedia(MEDIA_CONFIG)
            .then(stream => {
                stream.getTracks()
                    .forEach(track => this.peerConnection.addTrack(track, stream));
                this.peerConnection
                    .createOffer()
                    .then(sdp => this.peerConnection.setLocalDescription(sdp));
            });
    }

    initHandlers() {
        this.peerConnection.oniceconnectionstatechange = e => console.log('Ice candidate change', e);
        this.peerConnection.onicecandidate = e => {
            // onicecandidate will emit `null` when done collecting ice candidates
            if (e.candidate === null) {
                const sdp = this.peerConnection.localDescription?.sdp;
                if (sdp) {
                    console.log('Sending SDP Offer');
                    this.signal.sendOffer(sdp);
                } else {
                    console.error('No SDP');
                }
            }
        }
        this.peerConnection.ontrack = e => {
            console.log('Track Added', e);
            const el = document.createElement(e.track.kind) as HTMLAudioElement;
            el.srcObject = e.streams[0];
            el.autoplay = true;

            document.getElementById('audio')?.appendChild(el);
        }
    }

}

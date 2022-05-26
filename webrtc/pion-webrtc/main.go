package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	pb "github.com/SamWolfs/protocol-examples/webrtc/pion-webrtc/proto"
	"github.com/gorilla/websocket"
	"github.com/pion/rtcp"
	"github.com/pion/rtp"
	"github.com/pion/webrtc/v3"
	"google.golang.org/protobuf/proto"
)

type state struct {
	pc       *webrtc.PeerConnection
	signal   *websocket.Conn
	sdp      chan string
	sender *webrtc.RTPSender
	track *webrtc.TrackLocalStaticRTP
}

type udpConn struct {
	conn        *net.UDPConn
	port        int
	payloadType uint8
}

var addr = flag.String("addr", "localhost:8080", "http service address")
var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
	return true
}}

func startWebRTC(w http.ResponseWriter, r *http.Request) {
	webRTC := &state{
		sdp: make(chan string, 1),
	}

	var err error

	webRTC.signal, err = upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	log.Println("Initialized websocket connection")
	defer webRTC.signal.Close()

	go func() {
		for {
			_, message, err := webRTC.signal.ReadMessage()
			if err != nil {
				log.Println("Error reading:", err)
				break
			}
			envelope := &pb.Envelope{}
			if err := proto.Unmarshal(message, envelope); err != nil {
				log.Fatalln("Failed to decode envelope:", err)
			}
			switch envelope.Payload.(type) {
			case *pb.Envelope_SdpOffer:
				log.Println("Received SDP Offer")
				webRTC.sdp <- envelope.GetSdpOffer().Sdp
			default:
				log.Println("Received unexpected envelope")
			}
		}
	}()

	initPeerConnection(webRTC)

	go startSender(webRTC)

	select {}
}

func startSender(webRTC *state) {
	var err error

	go func() {
		rtcpBuf := make([]byte, 1500)
		for {
			if _, _, rtcpErr := webRTC.sender.Read(rtcpBuf); rtcpErr != nil {
				return
			}
		}
	}()

	var laddr *net.UDPAddr
	if laddr, err = net.ResolveUDPAddr("udp", "127.0.0.1:5000"); err != nil {
		panic(err)
	}

	listener, err := net.ListenUDP("udp", laddr)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = listener.Close(); err != nil {
			panic (err)
		}
	}()

	inboundRTPPacket := make([]byte, 1500)
	for {
		n, _, err := listener.ReadFrom(inboundRTPPacket)
		if err != nil {
			panic(fmt.Sprintf("error during read: %s", err))
		}

		log.Println(time.Now().Unix())
		if _, err = webRTC.track.Write(inboundRTPPacket[:n]); err != nil {
			if errors.Is(err, io.ErrClosedPipe) {
				return
			}

			panic(err)
		}

	}
}

func startReceiver(webRTC *state, track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
	var laddr *net.UDPAddr
	var err error
	if laddr, err = net.ResolveUDPAddr("udp", "127.0.0.1:"); err != nil {
		panic(err)
	}

	var raddr *net.UDPAddr
	if raddr, err = net.ResolveUDPAddr("udp", fmt.Sprintf("127.0.0.1:%d", 4000)); err != nil {
		panic(err)
	}

	var conn *net.UDPConn
	if conn, err = net.DialUDP("udp", laddr, raddr); err != nil {
		panic(err)
	}

	defer func() {
		if closeErr := conn.Close(); closeErr != nil {
			panic(closeErr)
		}
	}()

	go func() {
		ticker := time.NewTicker(time.Second * 2)
		for range ticker.C {
			if rtcpErr := webRTC.pc.WriteRTCP([]rtcp.Packet{&rtcp.PictureLossIndication{MediaSSRC: uint32(track.SSRC())}}); rtcpErr != nil {
				log.Println(rtcpErr)
			}
		}
	}()

	b := make([]byte, 1500)
	rtpPacket := &rtp.Packet{}
	for {
		n, _, readErr := track.Read(b)
		if readErr != nil {
			panic(readErr)
		}

		if err = rtpPacket.Unmarshal(b[:n]); err != nil {
			panic(err)
		}
		rtpPacket.PayloadType = 96

		if n, err = rtpPacket.MarshalTo(b); err != nil {
			panic(err)
		}

		if _, writeErr := conn.Write(b[:n]); writeErr != nil {
			var opError *net.OpError
			if errors.As(writeErr, &opError) && opError.Err.Error() == "write: connection refused" {
				continue
			}
			panic(writeErr)
		}

	}
}

func initPeerConnection(webRTC *state) {
	var err error

	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	webRTC.pc, err = webrtc.NewPeerConnection(config)

	if err != nil {
		panic(err)
	}

	// Add audio track
	audioTrack, err := webrtc.NewTrackLocalStaticRTP(webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus}, "audio", "pion")
	if err != nil {
		panic(err)
	}
	webRTC.track = audioTrack

	webRTC.sender, err = webRTC.pc.AddTrack(audioTrack)

	webRTC.pc.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
		log.Println("Connection state has changed:", connectionState.String())

		if connectionState == webrtc.ICEConnectionStateConnected {
			log.Println("WebRTC Connection established!")
		} else if connectionState == webrtc.ICEConnectionStateFailed {
			if closeErr := webRTC.pc.Close(); closeErr != nil {
				panic(closeErr)
			}
			os.Exit(0)
		}
	})

	webRTC.pc.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		codec := track.Codec()
		if strings.EqualFold(codec.MimeType, webrtc.MimeTypeOpus) {
			go startReceiver(webRTC, track, receiver)
		} else {
			log.Println("Received unexpected track", codec)
		}
	})

	gatherComplete := make(chan bool, 1)

	webRTC.pc.OnICECandidate(func(candidate *webrtc.ICECandidate) {
		if candidate == nil {
			log.Println("Finished gathering ICE candidates")

			sdp := webRTC.pc.CurrentLocalDescription().SDP
			answer := buildSDPAnswer(sdp)
			answerOut, err := proto.Marshal(answer)
			if err != nil {
				log.Fatalln("Failed to encode SDP Answer:", err)
			}
			webRTC.signal.WriteMessage(websocket.BinaryMessage, answerOut)
			gatherComplete <- true
		}
	})

	// wait for offer to be received
	offer := webrtc.SessionDescription{SDP: <-webRTC.sdp, Type: webrtc.SDPTypeOffer}
	if err = webRTC.pc.SetRemoteDescription(offer); err != nil {
		panic(err)
	}

	// Initialize SDP Answer
	answer, err := webRTC.pc.CreateAnswer(nil)
	if err != nil {
		panic(err)
	}
	if err = webRTC.pc.SetLocalDescription(answer); err != nil {
		panic(err)
	}

	<-gatherComplete
}

func buildSDPAnswer(sdp string) *pb.Envelope {
	return &pb.Envelope{
		Payload: &pb.Envelope_SdpAnswer{
			&pb.SdpAnswer{
				Sdp: sdp,
			},
		},
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", startWebRTC)
	log.Fatal(http.ListenAndServe(*addr, nil))
}

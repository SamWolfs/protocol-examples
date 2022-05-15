package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	pb "github.com/SamWolfs/protocol-examples/websocket/servers/gorilla_server/proto"
	"google.golang.org/protobuf/proto"
)

var addr = flag.String("addr", "localhost:8080", "http service address")

var upgrader = websocket.Upgrader{} // use default options

func echo(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		command := &pb.Command{}
		if err := proto.Unmarshal(message, command); err != nil {
			log.Fatalln("Failed to decode command:", err)
		}
		switch command.Payload.(type) {
			case *pb.Command_Echo:
				log.Println("Echo Command")
			case *pb.Command_Increment:
				command.GetIncrement().Value++
				log.Println("Increment Command")
		}
		log.Printf("recv: %s", command)
		out, err := proto.Marshal(command)
		if err != nil {
			log.Fatalln("Failed to encode command:", err)
		}
		err = c.WriteMessage(websocket.BinaryMessage, out)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/", echo)
	log.Fatal(http.ListenAndServe(*addr, nil))
}


import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MetricDto } from './metric.dto';

@WebSocketGateway({
    cors : {
        origin : ['http://localhost:3000'],
        credentials : false,
    },
})

export class RealtimeGateway 
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
        @WebSocketServer() server : Server;

        private timer ?: NodeJS.Timeout;

        afterInit() {
            // Emit dummy metric per 1 sec
            this.timer = setInterval(() => {
                const m : MetricDto = {
                    ts : Date.now(),
                    name : 'temp',
                    value : 35 + Math.random() * 5,
                };

                // Emit to all clients
                this.server.emit('metric', m);
            }, 1000);
        }

        handleConnection(socket : any) {
            // Optional : log connections
            console.log('WS connected: ', socket.id);
        }

        handleDisconnect(socket : any) {
            // Optional : log disconnections
            console.log('WS disconnected: ', socket.id)
        }
    }
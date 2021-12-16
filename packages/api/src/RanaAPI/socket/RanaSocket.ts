import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { Logger } from '../Logger';

export default class RanaSocket {

  public static TAG = 'RanaSocket';

  socket: SocketIOServer
  logger: Logger = new Logger(RanaSocket.TAG)

  constructor(server: HTTPServer) {
    this.socket = new SocketIOServer(server, {
      cors: {
        origin: "*"
      }
    });
    this.init();
  }

  init() {
    this.socket.on('connection', client => {
      client.on('disconnect', () => {
        this.logger.log('disconnect');
      });

      client.on('hello', (message: string) => {
        this.logger.log(message);
      })
    });
  }
}
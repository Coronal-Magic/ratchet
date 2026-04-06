import { Client, Room } from 'colyseus.js';

export class NetworkManager {
  private client: Client;
  public room?: Room;

  constructor() {
    // Colyseus client expects an HTTP(S) endpoint for matchmaking and upgrades to WS internally.
    // Allow Vite override via env, otherwise default to localhost:2567 for local dev.
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const host = import.meta.env.VITE_SERVER_HOST || window.location.hostname || 'localhost';
    const port = import.meta.env.VITE_SERVER_PORT || '2567';
    this.client = new Client(`${protocol}://${host}:${port}`);
  }

  async joinOrCreate(roomName: string, options: Record<string, any>): Promise<Room> {
    this.room = await this.client.joinOrCreate(roomName, options);
    console.log(`🎮 Joined room: ${this.room.roomId}`);
    return this.room;
  }

  async join(roomId: string, options: Record<string, any>): Promise<Room> {
    this.room = await this.client.joinById(roomId, options);
    return this.room;
  }

  disconnect() {
    this.room?.leave();
    this.room = undefined;
  }
}

import { Client, Room } from 'colyseus.js';

export class NetworkManager {
  private client: Client;
  public room?: Room;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
    this.client = new Client(`${protocol}://${host}:2567`);
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

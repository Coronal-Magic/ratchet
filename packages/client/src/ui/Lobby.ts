/**
 * Lobby UI manager — handles room listing, character selection, ready state.
 * Currently handled inline in index.html + main.ts.
 * This file is for future expansion (room browser, chat, etc.)
 */

export class Lobby {
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('lobby')!;
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}

import { Game } from './game/Game.js';

const game = new Game();

// Lobby UI
const lobby = document.getElementById('lobby')!;
const playBtn = document.getElementById('play-btn')!;
const nameInput = document.getElementById('player-name') as HTMLInputElement;
const raceSelect = document.getElementById('race-select') as HTMLSelectElement;
const variantSelect = document.getElementById('variant-select') as HTMLSelectElement;
const modeSelect = document.getElementById('mode-select') as HTMLSelectElement;

// Update variant options based on race
raceSelect.addEventListener('change', () => {
  const variants =
    raceSelect.value === 'dwarf'
      ? [['miner', 'Miner'], ['blacksmith', 'Blacksmith'], ['berserker', 'Berserker']]
      : [['tinkerer', 'Tinkerer'], ['alchemist', 'Alchemist'], ['scout', 'Scout']];

  variantSelect.innerHTML = variants
    .map(([val, label]) => `<option value="${val}">${label}</option>`)
    .join('');
});

playBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim() || 'Anonymous';
  const race = raceSelect.value;
  const variant = variantSelect.value;
  const mode = modeSelect.value;

  lobby.style.display = 'none';
  document.getElementById('hud')!.classList.add('active');

  await game.connect({ name, race, variant, mode });
  game.start();
});

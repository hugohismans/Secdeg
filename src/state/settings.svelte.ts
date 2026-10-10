/** Réglages globaux : mode projection. */
import { PROJECTION, PROGRESS } from '../config';
import { loadJSON, saveJSON } from './storage';

const KEY = `${PROGRESS.storageKey}.settings`;

interface Settings {
  projection: boolean;
}

const data = $state<Settings>(loadJSON<Settings>(KEY, { projection: false }));

function apply() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('projection', data.projection);
  root.style.setProperty('--scale', data.projection ? String(PROJECTION.scale) : '1');
}

apply();

export const settings = {
  get projection() {
    return data.projection;
  },
  set projection(v: boolean) {
    data.projection = v;
    apply();
    saveJSON(KEY, { projection: v });
  },
};

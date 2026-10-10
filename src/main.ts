import { mount } from 'svelte';
import 'katex/dist/katex.min.css';
// Polices embarquées (fonctionnent hors ligne)
import '@fontsource/alegreya/latin-500.css';
import '@fontsource/alegreya/latin-500-italic.css';
import '@fontsource/alegreya/latin-700.css';
import '@fontsource/alegreya/latin-800.css';
import '@fontsource/alegreya-sans/latin-400.css';
import '@fontsource/alegreya-sans/latin-400-italic.css';
import '@fontsource/alegreya-sans/latin-500.css';
import '@fontsource/alegreya-sans/latin-700.css';
import '@fontsource/reem-kufi/arabic-500.css';
import './app.css';
import App from './App.svelte';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const app = mount(App, { target: document.getElementById('app')! });

export default app;

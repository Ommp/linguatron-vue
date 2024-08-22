import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css'
import App from './App.vue';

import { createMemoryHistory, createRouter } from 'vue-router';

//routes
import Decks from './views/Decks.vue';
import Deck from './views/Deck.vue';
import Dashboard from './views/Dashboard.vue';
import Learn from './views/Learn.vue';
import Review from './views/Review.vue';
import CardBrowser from './views/CardBrowser.vue';
import CreateCard from './views/CreateCard.vue';
import CreateDeck from './views/CreateDeck.vue';

const routes = [
    { path: "/decks", component: Decks },
    { path: "/deck/create", component: CreateDeck },
    { path: "/deck/:id", component: Deck },
    { path: "/deck/:id/learn", component: Learn },
    { path: "/deck/:id/review", component: Review },
    { path: "/deck/:id/cards", component: CardBrowser },
    { path: "/deck/:id/createcard", component: CreateCard },
    { path: "/", component: Dashboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app')

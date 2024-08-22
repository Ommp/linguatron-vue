<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

    const decks = ref([]);

    async function fetchDecks() {
        
        try {
            const res = await fetch("http://127.0.0.1:3000/api/decks");
            const decks = await res.json();
            return decks;
        } catch (error) {
            console.error(error);
        }


    }


onMounted( async () => {
    const data = await fetchDecks();
    decks.value = data;
});

</script>
<template>
    <div class="grid justify-items-center text-center font-mono">
        <h1 class="text-4xl">Decks</h1>

        <RouterLink :to="`/deck/create`" class="btn mb-4 font-bold text-2xl">Create Deck</RouterLink>

        <ul class="flex flex-col gap-1">

            <RouterLink v-for="deck in decks" :to="`/deck/${deck.deck_id}`" class="btn">
                {{ deck.deckname }}
            </RouterLink>

        </ul>
    </div>
</template>
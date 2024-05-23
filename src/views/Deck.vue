<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const deck = ref();

const loading = ref(true);

async function fetchDeck(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}`);
        const deck = await res.json();
        return deck;
    } catch (error) {
        console.error(error);
    }


}

onMounted(async () => {
    const data = await fetchDeck(route.params.id);
    deck.value = data;
    loading.value = false;
});

</script>

<template>

    <div v-if="!loading" class="grid justify-items-center gap-2">
        <h1 class="text-4xl">{{ deck.deckname }}</h1>
        <!-- <p>deck id: {{ deck.deck_id }}</p> -->
        <div class="flex flex-row gap-2">
            <RouterLink :to="`/deck/${deck.deck_id}/learn`" class="btn min-w-32">Learn</RouterLink>
            <RouterLink :to="`/deck/${deck.deck_id}/review`" class="btn min-w-32">Review</RouterLink>
        </div>
        <div class="flex flex-row gap-2">
            <RouterLink :to="`/deck/${deck.deck_id}/cards`" class="btn min-w-32">Card Browser</RouterLink>
            <RouterLink :to="`/deck/${deck.deck_id}/createcard`" class="btn min-w-32">Create card</RouterLink>
        </div>

    </div>


</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const cards = ref([]);
const route = useRoute();

const loading = ref(true);


async function fetchCardsFromOneDeck(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}/cards`);
        const decks = await res.json();
        return decks;
    } catch (error) {
        console.error(error);
    }


}

onMounted(async () => {
    cards.value = await fetchCardsFromOneDeck(route.params.id);
    loading.value = false;
});

</script>

<template>
    <div>
        <h1 class="text-4xl text-center">Card Browser</h1>
    </div>

    <div class="grid justify-items-center text-center" v-if="!loading">
        <h1 class="text-2xl">Cards</h1>


        <table>
            <tr>
                <th>Question</th>
                <th>Answer</th>
            </tr>
            <tr v-for="card in cards">
                <th>
                    {{ card.question }}
                </th>
                <th>
                    {{ card.answer }}
                </th>
            </tr>
        </table>
    </div>

</template>

<style scoped>

</style>
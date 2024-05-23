<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const deck = ref();

const loading = ref(true);

const formQuestion = ref("default");
const formAnswer = ref("default");

async function fetchDeck(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}`);
        const deck = await res.json();
        return deck;
    } catch (error) {
        console.error(error);
    }


}

async function createCard() {
    const id = route.params.id;
    const data = {question: formQuestion.value, answer: formAnswer.value, deck_id: id};
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}/card/create`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return res.json();
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

    <div v-if="!loading" class="grid justify-center gap-2">
        <h1 class="text-4xl">{{ deck.deckname }}</h1>
        <p>deck id: {{ deck.deck_id }}</p>
        <RouterLink :to="`/deck/${deck.deck_id}/`" class="btn">Back to deck page</RouterLink>
    </div>

    <br>

    <div v-if="!loading" class="grid justify-center gap-2">
        <input type="text" v-model="formQuestion" placeholder="Enter question">
        <input type="text" v-model="formAnswer" placeholder="Enter answer">

        <h1>Form Question: {{ formQuestion }}</h1>
        <h1>Form Answer: {{ formAnswer }}</h1>

        <button @click="createCard" class="btn">Create card</button>
    </div>

</template>
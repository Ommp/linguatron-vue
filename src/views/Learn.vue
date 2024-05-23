<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {Deck, Card} from '../interfaces';

const route = useRoute();

const deck = ref<Deck>();
const cards = ref([]);

const loading = ref(true);

const formAnswer = ref("");

async function fetchDeck(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}`);
        const deck = await res.json();
        return deck;
    } catch (error) {
        console.error(error);
    }


}

async function getRandomLearningCards(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}/randomlearningcards`);
        const deck = await res.json();
        return deck;
    } catch (error) {
        console.error(error);
    }


}

async function updateCard(card_id: number, correctInARow: number) {
    console.error("updatecard's correct-in-a-row: " + correctInARow);
    const data = { answer: formAnswer.value, card_id: card_id, correct_in_a_row: correctInARow };
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/learning/updatecard`, {
            method: "PUT",
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

async function deleteCard() {
    const data = { card_id: cards.value[0].card_id};
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/card/delete`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        cards.value.shift();
        return res.json();
    } catch (error) {
        console.error(error);
    }
}


onMounted(async () => {
    deck.value = await fetchDeck(route.params.id);
    cards.value = await getRandomLearningCards(route.params.id);
    loading.value = false;
});

function moveCurrentCardToLast() {
    cards.value.push(cards.value[0]);
    cards.value.shift();
}

function handleAnswer() {

    const cardAnswer = <String>cards.value[0].answer.toLowerCase();
    formAnswer.value = formAnswer.value.toLowerCase();

    //if answer is false, move question to last in queue
    if (formAnswer.value != cardAnswer ) {
        cards.value[0].incorrect++;
        cards.value[0].correctInARow = 0;
        updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
    }
    if (formAnswer.value == cardAnswer) {
        //card not correct two times in a row
        if (cards.value[0].correctInARow < 1 || !cards.value[0].correctInARow) {
            cards.value[0].correctInARow = 1;
            console.log("not two in a row");
            console.log(cards.value[0].correctInARow);
            updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
        } else /*correct two times in a row*/ {
            console.log("two in a row");
            cards.value[0].correctInARow++;
            console.log(cards.value[0].correctInARow);
            updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
            cards.value.shift();
        }
        
        moveCurrentCardToLast();
    }


}


</script>

<template>


    <div v-if="!loading">
        <h1>Learning session for deck: {{ deck.deckname }}</h1>
        <h5>Question</h5>
        <p>{{ cards[0].question }}</p>
        <!-- <p>{{ cards }}</p> -->
        <h5>Type your answer:</h5>
        <input type="text" v-model="formAnswer" placeholder="Enter answer" @submit="handleAnswer">
        <button @click="handleAnswer" class="btn">Submit answer</button>
        <button @click="deleteCard" class="btn-warning">Delete card</button>
    </div>


</template>
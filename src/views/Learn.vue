<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {Deck, Card} from '../interfaces';

const route = useRoute();

const deck = ref<Deck>();
const cards = ref<Card[]>([]);

const loading = ref(true);

const formAnswer = ref("");

const multipleChoice = ref(true);

const multipleChoiceCards = ref<Card[]>([]);

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
async function getMultipleChoiceCards(id: number) {

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/${id}/multiplechoicecards`);
        const cards0 = await res.json();

        //add correct card to multiple choice cards
        cards0.push(cards.value[0]);
        const shuffled = cards0
            .map((value: Card) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

        return shuffled;
    } catch (error) {
        console.error(error);
    }


}

async function setMultipleChoice() {
    multipleChoiceCards.value = await getMultipleChoiceCards(route.params.id);
}

async function updateCard(card_id: number, correctInARow: number) {
    const data = { type: "learning", answer: formAnswer.value, card_id: card_id, correct_in_a_row: correctInARow, last_review_date: new Date().toISOString()};
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
    setMultipleChoice();
    loading.value = false;
});

function moveCurrentCardToLast() {
    cards.value.push(cards.value[0]);
    cards.value.shift();
}

async function handleButtonAnswer(card:Card) {
    formAnswer.value = card.answer;
    handleAnswer();
}

async function handleAnswer() {

    const cardAnswer = <String>cards.value[0].answer.toLowerCase();
    formAnswer.value = formAnswer.value.toLowerCase();

    //if answer is false, move question to last in queue
    if (formAnswer.value != cardAnswer ) {
        cards.value[0].incorrect++;
        cards.value[0].correctInARow = 0;
        updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
        moveCurrentCardToLast();
        setMultipleChoice();
    }
     else if (formAnswer.value == cardAnswer) {
        //card not correct two times in a row
        if (cards.value[0].correctInARow < 1 || !cards.value[0].correctInARow) {
            cards.value[0].correctInARow = 1;
            updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
            moveCurrentCardToLast();
            setMultipleChoice();
        } else /*correct two times in a row*/ {
            cards.value[0].correctInARow++;
            updateCard(cards.value[0].card_id, cards.value[0].correctInARow);
            cards.value.shift();
            setMultipleChoice();
        }
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
        <div v-if="multipleChoice" class="multiplechoice">
            <ul class="flex flex-col gap-1">
                <button v-for="card in multipleChoiceCards" class="btn" @click="handleButtonAnswer(card)">
                    {{ card.answer }}
                </button>
            </ul>
        </div>
    </div>


</template>
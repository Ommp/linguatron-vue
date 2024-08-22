<script setup lang="ts">
import { ref } from 'vue';


const deckName = ref("");

async function createDeck() {
    const data = { deckname: deckName.value };
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/deck/create`, {
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

</script>

<template>

    <br>

    <div class="grid justify-center gap-2 font-mono">
        <input type="text" v-model="deckName" placeholder="Enter deck name">

    </div>
    <div class="grid justify-center font-mono"><button @click="createDeck" class="btn ">Create deck</button></div>

</template>
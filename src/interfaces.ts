export interface Deck {
    deck_id: number,
    deckname: string
}
export interface Card {
    deck_id: number,
    card_id: number,
    answer: string,
    question: string,
    last_review_date: string,
    card_created: string,
    card_created_time_zone: string,
    stage: string,
    ease: number,
    correct: number,
    incorrect: number,
    lapses: number,
}
class ShakespeareanTextGenerator {
    constructor() {
        this.phrases = [
            "To be, or not to be, that is the question:",
            "All the world's a stage, and all the men and women merely players.",
            "What's in a name? That which we call a rose by any other name would smell as sweet.",
            "The lady doth protest too much, methinks.",
            "Now is the winter of our discontent"
        ];
    }

    generateResponse(userInput) {
        const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        return `${randomPhrase} (In response to: ${userInput})`;
    }
}

export default ShakespeareanTextGenerator;

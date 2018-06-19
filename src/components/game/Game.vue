<template>
    <div class="game-window" @click="reFocus">
        <p class="awaited-word">
            <span v-for="(letter, index) in wordToTypeLetters" :key="index" ref="letterToType">{{letter}}</span>
        </p>
        <p>Level: {{level}}</p>
        <p>{{countdownDisplay}}</p>
        <input :disabled="!canStillPlay" type="text" name="" ref="gameInput" @blur="reFocus" @input="compareInputToExpected" v-model="entry">
    </div>
</template>

<script>
export default {
    name: 'Game',

    props: ['words', 'level'],

    data() {
        return {
            wordToTypeIndex: 0,
            letterToTypeIndex: 0,
            entry: '',
            previousEntry: '',
            levelCountdown: 0,
            interval: null,
            canStillPlay: true,
            hundrethSecondMinute: 6000,
            wordsPerMinute: 10,
        };
    },

    methods: {
        toggleCheck() {
            this.$emit('toggleCheck', this.label);
        },

        reFocus() {
            this.$refs.gameInput.focus();
        },

        compareInputToExpected() {
            if (this.entry.length) {
                const currentLetterElement = this.$refs.letterToType[this.letterToTypeIndex];
                if (this.wordToTypeLetters[this.letterToTypeIndex] === this.entry) {
                    this.stylizeWithClass(currentLetterElement, false, 'letter-error');
                    this.stylizeWithClass(currentLetterElement, true, 'letter-found');
                    this.nextLetterToFind();
                } else {
                    this.stylizeWithClass(currentLetterElement, true, 'letter-error');
                }
                if (this.letterToTypeIndex === this.wordToType.length) {
                    for (let span of this.$refs.letterToType) {
                        this.stylizeWithClass(span, false, 'letter-error');
                        this.stylizeWithClass(span, false, 'letter-found');
                    }
                    this.letterToTypeIndex = 0;
                    if (this.wordToTypeIndex < this.words.length - 1) {
                        this.clearCountdown();
                        this.wordToTypeIndex += 1;
                    } else {
                        this.$emit('nextLevel');
                        this.wordToTypeIndex = 0;
                    }
                    this.$nextTick(function() {
                        this.launchNewCountdown();
                        this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
                    });
                }
            }
            this.entry = '';
        },

        stylizeWithClass(element, shouldAdd, styleClass) {
            if (shouldAdd) {
                element.classList.add(styleClass);
            } else {
                element.classList.remove(styleClass);
            }
        },

        nextLetterToFind() {
            if (this.letterToTypeIndex < this.wordToType.length) {
                this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], false, 'letter-to-type');
                this.letterToTypeIndex += 1;
                if (this.letterToTypeIndex < this.wordToType.length) {
                    this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
                }
            }
        },

        modifyCountdownDisplay() {
            if (this.levelCountdown > 0) {
                this.levelCountdown -= 1;
            } else {
                this.timeExceeded();
            }
        },

        launchNewCountdown() {
            this.levelCountdown = this.allotedTime;
            this.interval = window.setInterval(() => this.modifyCountdownDisplay(), 10);
        },

        clearCountdown() {
            window.clearInterval(this.interval);
        },

        timeExceeded() {
            this.levelCountdown = 0;
            this.canStillPlay = false;
            this.clearCountdown();
        },
    },

    computed: {
        wordToType() {
            return this.words[this.wordToTypeIndex];
        },

        wordToTypeLetters() {
            return this.wordToType.split('');
        },

        allotedTime() {
            return this.hundrethSecondMinute / (this.wordsPerMinute + this.level - 1);
        },

        countdownDisplay() {
            return (this.levelCountdown / 100).toFixed(2);
        },
    },

    mounted() {
        this.$refs.gameInput.focus();
        this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
        this.launchNewCountdown();
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes splat {
        0% {font-size: calc(#{$big-font-size} + 0.3rem);}
        40% {font-size: calc(#{$big-font-size} - 0.1rem);}
        80% {font-size: $big-font-size;}
    }

    .game-window {
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .awaited-word {
            margin: 0;

            span {
                font-family: $brand-font;
                font-weight: $bold-weight;
                font-size: $big-font-size;
                color: $contrast-color;
                position: relative;
            }

            .letter-to-type::after {
                position: absolute;
                content: '';
                width: 100%;
                height: 0.6rem;
                left: 0;
                bottom: -0.6rem;
                background-color: $light-base-color;
            }

            .letter-found {
                color: $light-base-color;
                transition: all 0.2s cubic-bezier(0.5,0,0,1);;
            }

            .letter-error {
                color: $warning-color;
                animation: splat 0.2s 1;
            }
        }

        input {
            position: absolute;
            top: -50px;
        }
    }
</style>
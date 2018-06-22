const levelMapping = {
    1: {
        default: {
            wordLength: {min: 0, max: 4},
            frequency: {min: 10, max: 90000},
        },
        masochist: {
            wordLength: {min: 3, max: 6},
            frequency: {min: 1, max: 100},
        },
    },
    2: {
        default: {
            wordLength: {min: 3, max: 5},
            frequency: {min: 10, max: 90000},
        },
        masochist: {
            wordLength: {min: 4, max: 7},
            frequency: {min: 1, max: 100},
        },
    },
    3: {
        default: {
            wordLength: {min: 4, max: 7},
            frequency: {min: 10, max: 90000},
        },
        masochist: {
            wordLength: {min: 5, max: 8},
            frequency: {min: 1, max: 100},
        },
    },
    4: {
        default: {
            wordLength: {min: 4, max: 8},
            frequency: {min: 10, max: 90000},
        },
        masochist: {
            wordLength: {min: 6, max: 10},
            frequency: {min: 1, max: 100},
        },
    },
    5: {
        default: {
            wordLength: {min: 5, max: 10},
            frequency: {min: 1, max: 90000},
        },
        masochist: {
            wordLength: {min: 7, max: 11},
            frequency: {min: 1, max: 100},
        },
    },
    6: {
        default: {
            wordLength: {min: 6, max: 11},
            frequency: {min: 1, max: 90000},
        },
        masochist: {
            wordLength: {min: 8, max: 12},
            frequency: {min: 1, max: 100},
        },
    },
    7: {
        default: {
            wordLength: {min: 7, max: 12},
            frequency: {min: 1, max: 500},
        },
        masochist: {
            wordLength: {min: 9, max: 13},
            frequency: {min: 0, max: 50},
        },
    },
    8: {
        default: {
            wordLength: {min: 7, max: 13},
            frequency: {min: 1, max: 500},
        },
        masochist: {
            wordLength: {min: 9, max: 14},
            frequency: {min: 0, max: 50},
        },
    },
    9: {
        default: {
            wordLength: {min: 7, max: 14},
            frequency: {min: 1, max: 100},
        },
        masochist: {
            wordLength: {min: 9, max: 15},
            frequency: {min: 0, max: 10},
        },
    },
    10: {
        default: {
            wordLength: {min: 7, max: 15},
            frequency: {min: 1, max: 100},
        },
        masochist: {
            wordLength: {min: 10, max: 20},
            frequency: {min: 0, max: 1},
        },
    },
};

export default {
    filterWordsOnRule(wordDatas, level, ismasochist, wordCount) {
        const ruleName = ismasochist ? 'masochist' : 'default';
        const currentLevel = level > 10 ? 10 : level;
        const rule = levelMapping[currentLevel][ruleName];
        let filteredWords = wordDatas.filter((wordData) => {
            return this.doesWordRespectsRules(wordData, rule);
        });
        if (filteredWords.length < wordCount) {
            filteredWords = filteredWords.filter((wordData) => {
                return this.doesWordRespectsLengths(wordData.word.length, rule) && !filteredWords.includes(wordData);
            });
        }
        if (filteredWords.length < wordCount) {
            const remainingWords = wordCount - filteredWords.length;
            wordDatas.sort(this.frequencyComparison);
            if (ismasochist) {
                filteredWords.push(...wordDatas.slice(0, remainingWords));
            } else {
                filteredWords.push(...wordDatas.slice(-remainingWords));
            }
        }
        return filteredWords;
    },

    doesWordRespectsRules(wordData, rule) {
        const wordFreqData = wordData.tags[wordData.tags.length - 1];
        const wordFreq = wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        const wordLength = wordData.word.length;
        return this.doesWordRespectsLengths(wordLength, rule) &&
            wordFreq >= rule.frequency.min &&
            wordFreq <= rule.frequency.max;
    },

    doesWordRespectsLengths(wordLength, rule) {
        return wordLength >= rule.wordLength.min && wordLength <= rule.wordLength.max;
    },

    frequencyComparison(a, b) {
        function getWordFrequency(wordData) {
            const wordFreqData = wordData.tags[wordData.tags.length - 1];
            return wordFreqData.substr(0, 2) === 'f:' ? parseFloat(wordFreqData.substr(2)) : 0;
        }
        return getWordFrequency(a) - getWordFrequency(b);
    },

};

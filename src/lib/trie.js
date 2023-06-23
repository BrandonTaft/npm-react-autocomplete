
class TrieNode {
    constructor(letter, originalIndex) {
        this.letter = letter;
        this.previousLetter = null;
        this.nextLetters = {};
        this.end = false;
        this.originalIndex = originalIndex;

        this.getWord = function () {
            let output = [];
            let node = this;
            while (node !== null) {
                output.unshift(node.letter);
                node = node.previousLetter;
            };
            const originalObject = {
                value: output.join(''),
                originalIndex: this.originalIndex
            };
            return originalObject;
        };

        this.getOneWord = function () {
            let output = [];
            let node = this;
            while (node !== null) {
                output.unshift(node.letter);
                node = node.previousLetter;
            };
            const originalObject = {
                value: output.join(''),
                originalIndex: this.originalIndex
            };
            return originalObject;
        };
    };
};

export default class Trie {
    constructor() {
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        this.root = new TrieNode(null);
        // inserts a word into the trie.
        this.insert = function (word, originalIndex) {
            // start at the root
            let node = this.root;
            // for every character in the word
            for (let i = 0; i < word.length; i++) {
                // check to see if character exists in nextLetters.
                if (!node.nextLetters[word[i]]) {
                    // if it doesn't exist, then create new node.
                    node.nextLetters[word[i]] = new TrieNode(word[i]);
                    // also assign the previousLetter to the child node.
                    node.nextLetters[word[i]].previousLetter = node;
                };
                // move to the next depth in the trie.
                node = node.nextLetters[word[i]];
                // check to see if we are on the last character.
                if (i === word.length - 1) {
                    //Store the index from the original array
                    node.originalIndex = originalIndex;
                    // if so, set the end flag to true.
                    node.end = true;
                };
            };
        };

        //  Return all words
        this.returnAll = () => {
            let output = [];
            findAllWords(this.root, output);
            return output.sort((a, b) => collator.compare(a.value, b.value));
        };


        // returns every word with given prefix
        this.find = function (value, showNoMatchMessage) {
            let prefix = value.toLowerCase();
            let node = this.root;
            let output = [];
            // for every character in the prefix
            for (let i = 0; i < prefix.length; i++) {
                // make sure prefix has any possible words available
                if (node.nextLetters[prefix[i]]) {
                    node = node.nextLetters[prefix[i]];
                } else if (node.nextLetters[prefix[i].toUpperCase()]) {
                    node = node.nextLetters[prefix[i].toUpperCase()];
                } else {
                    // if there are none then return it.
                    if (showNoMatchMessage) {
                        return (
                            [{ value: showNoMatchMessage, originalIndex: -1 }]
                        )
                    } else {
                        return output;
                    };
                };
            };
            // find all words in the node that match
            findAllWords(node, output);
            return output.sort((a, b) => collator.compare(a.value, b.value));
        };

        // find all words in the given node.
        const findAllWords = (node, arr) => {
            // base case, if node is at a word, push to output
            if (node.end) {
                arr.unshift(node.getWord());
            };
            // iterate through nextLetters, and find all possible matches with that prefix
            for (let child in node.nextLetters) {
                findAllWords(node.nextLetters[child], arr);
            };
        };

        // check if word is contained in trie.
        this.contains = function (value) {
            let word = value.toLowerCase()
            let node = this.root;
            // for every character in the word
            for (let i = 0; i < word.length; i++) {
                // check to see if character node exists in nextLetters.
                if (node.nextLetters[word[i]]) {
                    // if it exists, proceed to the next depth of the trie.
                    node = node.nextLetters[word[i]];
                } else if (node.nextLetters[word[i].toUpperCase()]) {
                    node = node.nextLetters[word[i].toUpperCase()];
                } else {
                    // doesn't exist, return false since it's not present.
                    return false;
                };
            };
            // return word if it is at node end
            if (node.end) {
                return node.getOneWord();
            } else {
                return false;
            };
        };
    };
};

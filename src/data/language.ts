import {randomRange, pickOne, pickN} from './utils'

export enum Category {
    City = 1, Animal, Plant, Mineral, Writing, Building, Region, Civ, Planet, CelestialBody, Religion
}

const SINGLE_IN_RUN: Category[] = [];
const SINGLE: Category[] = [Category.Planet, Category.Civ]

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const CONSENANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
const SYLLABLE_TYPES = ["cvc", "cv", "vc", "cvvc", "ccvc", "cvcc"]

class WordGenerator {

    private minSyllables: number
    private maxSyllables: number;
    private vowels: string[];
    private consenants: string[];
    private syllableTypes: string[];
    

    constructor(minSyllables: number, maxSyllables: number, vowels: string[], consenants: string[], syllableTypes: string[]) {
        this.minSyllables = minSyllables;
        this.maxSyllables = maxSyllables;
        this.vowels = vowels;
        this.consenants = consenants;
        this.syllableTypes = syllableTypes;
    }

    generateWord(): string {
        let result = "";
        let syllableCount = randomRange(this.minSyllables, this.maxSyllables);
        for (let i = 0; i < syllableCount; i++) {
            result += this.generateSyllable(pickOne(this.syllableTypes));
        }
        return result;
    }

    private generateSyllable(syllableType: string): string {
        let result = "";
        for (const char of syllableType) {
            switch (char) {
                case 'v':
                    result += pickOne(this.vowels);
                    break;
                case 'c':
                    result += pickOne(this.consenants);
                    break;
                default:
                    break;
            }
        }
        return result;
    }
}

export class Language {

    private wordGenerator: WordGenerator;
    private words: Map<string, Category>;
    private categories: Record<Category, string[]>;
    private wasGenerated: boolean[];

    constructor(wordGenerator: WordGenerator, words: Map<string, Category> | undefined) {
        this.wordGenerator = wordGenerator;
        this.categories = {
            [Category.Animal]: new Array(),
            [Category.Building]: new Array(),
            [Category.CelestialBody]: new Array(),
            [Category.City]: new Array(),
            [Category.Civ]: new Array(),
            [Category.Mineral]: new Array(),
            [Category.Planet]: new Array(),
            [Category.Plant]: new Array(),
            [Category.Region]: new Array(),
            [Category.Religion]: new Array(),
            [Category.Writing]: new Array()
        }
        if (words) {
            this.words = words;
            for (const [word, category] of this.words.entries()) {
                this.categories[category].push(word);
            }
        } else {
            this.words = new Map();
        }
        this.wasGenerated = (new Array(SINGLE_IN_RUN.length)).fill(false);
    }

    newWord(category: Category): string {
        let word = "";
        do {
            word = this.wordGenerator.generateWord();
        } while (this.words.has(word));
        this.words.set(word, category);
        this.categories[category].push(word);
        return word;
    }

    private alreadyGenerated(category: Category): boolean {
        let index = SINGLE_IN_RUN.indexOf(category);
        if (index == -1) {
            return false;
        } else if (this.wasGenerated[index]) {
            return true;
        } else {
            this.wasGenerated[index] = true;
            return false;
        }
    }

    getWord(category: Category, maybeNew: boolean): string {
        let size = this.categories[category].length;
        if (size == 0) {
            return this.newWord(category);
        }
        if (maybeNew && !SINGLE.includes(category) && !this.alreadyGenerated(category) && randomRange(0, size) == size) {
            return this.newWord(category);
        } else {
            return pickOne(this.categories[category]);
        }
    }

    replaceLanguage(): Language {
        return new Language(newWordGenerator(), this.words);
    }
}

export class LanguageManager {

    private language: Language;

    constructor() {
        this.language = newLanguage();
    }

    replaceLanguage(): void {
        this.language = this.language.replaceLanguage();
    }

    getLanguage(): Language {
        return this.language;
    }
}

function newWordGenerator(): WordGenerator {
    let minSyllables = randomRange(2, 3);
    let maxSyllables = randomRange(minSyllables, 5);
    let vowels = pickN(VOWELS, randomRange(2, 5));
    let consenants = pickN(CONSENANTS, randomRange(5, 10));
    let syllableTypes = pickN(SYLLABLE_TYPES, randomRange(1, 2));
    return new WordGenerator(minSyllables, maxSyllables, vowels, consenants, syllableTypes);
}

function newLanguage(): Language {
    return new Language(newWordGenerator(), undefined);
}

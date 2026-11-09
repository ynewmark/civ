import { Category, Language } from "./language";
import { pickOne } from "./utils";

export interface Template {
    generate: (language: Language) => string
}

type TemplateArg = string | Category | Template | (() => TemplateArg) | TemplateArg[];

function computeValue(language: Language, arg: TemplateArg): string {
    if (Array.isArray(arg)) {
        return computeValue(language, pickOne(arg));
    } else if (typeof arg == "string") {
        return arg;
    } else if (typeof arg == "object") {
        return arg.generate(language);
    } else if (typeof arg == "function") {
        return computeValue(language, arg());
    } else if (arg) {
        return language.getWord(arg, true);
    } else {
        return "";
    }
}

export function genTemplate(strings: TemplateStringsArray, ...values: TemplateArg[]): Template {
    return {generate: (language) => {
        return strings.reduce((result, str, i) => {
            const value = values[i];
            return result + str + computeValue(language, value);
        }, "");
    }}
}

export const TEMPLATES = {
    PEOPLE: genTemplate`${["Your people", genTemplate`The ${Category.Civ}`]}`,
    DISCOVERED: genTemplate`${["begun to", "learned how to", "discovered how to", "started to"]}`,
    MAINLY: genTemplate`${[" primarily", " mostly", " mainly", ""]}`
};

export const START_MESSAGE = genTemplate`The ${Category.Civ} are ${["a hostile", "an intelligent", "a pious", "an industrious"]} people on the planet ${Category.Planet}`;

import { Category, LanguageManager } from "./language";
import { genTemplate, Template, TEMPLATES } from "./message";
import { TechManager } from "./techs";
import { pickOne, shuffle } from "./utils";

type Effect = (t: TechManager, e: EventManager, l: LanguageManager, m: (text: string) => void, w: () => void) => void

function unlearnTechs(amount: number): Effect {
    return (t, e, l) => {
        for (let i = 0; i < amount; i++) {
            let tech = t.unlearnTech();
            if (tech) {
                e.setProbabilities(tech.eventChanges, true);
            } else {
                break;
            }
        }
    }
}

function learnRandomTech(): Effect {
    return (t, e, l, m) => {
        const tech = t.research(pickOne(t.getAvailable()));
        e.setProbabilities(tech.eventChanges);
        m(tech.message.generate(l.getLanguage()));
    }
}

function changeProbabilities(probabilities: Record<string, number>): Effect {
    return (t, e, l) => {
        e.setProbabilities(probabilities);
    };
}

function replaceLanguage(): Effect {
    return (t, e, l) => {
        l.replaceLanguage();
    }
}

function sendMessage(template: Template): Effect {
    return (t, e, l, m) => {
        m(template.generate(l.getLanguage()));
    }
}

function markWin(): Effect {
    return (t, e, l, m, w) => {
        w();
    }
}

function combine(...effects: Effect[]): Effect {
    return (t, e, l, m, w) => {
        effects.forEach((effect) => effect(t, e, l, m, w));
    }
}

function catastrophe(description: Template, size: number): Effect {
    return combine(
        unlearnTechs(size),
        replaceLanguage(),
        sendMessage(genTemplate`${description}, setting the world back in its progress`)
    )
}

function boost(name: string, text: Template): Effect {
    return combine(
        sendMessage(text),
        changeProbabilities({[name + "-boost"]: -.001})
    );
}

export type Event = {
    effect: Effect
}

const EVENTS: Record<string, Event> = {
    "learn-tech": {
        effect: learnRandomTech()
    },
    // great catastrophes
    "volcano": {
        effect: catastrophe(genTemplate`A super volcano${["", genTemplate` located in ${Category.Region}`]} erupted`, 5)
    },
    // 
    "astroid": {
        effect: catastrophe(genTemplate`A rogue astroid hit ${["the planet", Category.Planet]}`, 7)
    },
    // human catastrophies
    "plague": {
        effect: catastrophe(genTemplate`A ${["plague", "disease"]} has spread rapidly and wiped out a significant portion of the population`, 4)
    },
    "famine": {
        effect: catastrophe(genTemplate`Food sources have dwindled leading to significant population loss`, 4)
    },
    "conflict": {
        effect: catastrophe(genTemplate`${["What began as a", "A"]} conflict between the people of ${[Category.Region, Category.City]} and ${[Category.Region, Category.City]} has caused much population loss and destruction`, 3)
    },
    "nuclear-war": {
        effect: catastrophe(genTemplate`Full out nuclear war has erupted, wiping out a lot of the population and turning cities like ${Category.City} into rubble`, 5)
    },
    // development
    "city-formation": {
        effect: sendMessage(genTemplate`In ${Category.Region}, the city of ${Category.City} has ${["been founded", "been built", "reached significant size"]}, it is${TEMPLATES.MAINLY} ${
            [
                genTemplate`dedicated to the trade of commodities like ${[genTemplate`clothing made out of ${Category.Plant}`, genTemplate`tools made out of ${Category.Mineral}`]}`,
                genTemplate`a holy city for ${Category.Religion}`
            ]
        }`)
    },
    "religion": {
        effect: sendMessage(genTemplate`The religion of ${Category.Religion} has been founded, ${[
            genTemplate`its holy book is the ${Category.Writing}`,
            genTemplate`adherants refrain from eating ${Category.Animal}`,
            genTemplate`it is centered in ${Category.Region}`
        ]}`)
    },
    "construction": {
        effect: sendMessage(genTemplate`In ${[Category.Region, Category.City]} construction of the ${Category.Building} is underway, it is ${
            [genTemplate`a temple for ${Category.Religion}`, "the seat of government", "a large housing complex"]
        }`)
    },
    // research
    "writing-boost": {
        effect: boost("writing", genTemplate`A ${["scholar has", "scribe has", "wiseman has", "group of scholars have", "group of scribes have"]} completed ${
            ["a book of proverbs", "an epic", "a code of laws"]
        } known as the ${Category.Writing}. Who knows how future generations will see it?`)
    },
    "astronomy-boost": {
        effect: boost("astronomy", genTemplate`${["A scholar", "An astronomer"]} has discovered ${Category.CelestialBody} in the night sky`)
    },
    "sailing-boost": {
        effect: boost("sailing", genTemplate`Sailers from ${Category.Region} have reached the shores of ${Category.Region}, the inhabitants prove to be ${
            ["friendly", "hostile", "interesting"]
        }`)
    },
    "printing-press-boost": {
        effect: boost("printing-press", genTemplate`With the printing press, many copies of the ${Category.Writing} have been printed and it is now available to the masses`)
    },
    "taxonomy-boost": {
        effect: boost("taxonomy", genTemplate`There is much uproar in ${["scholarly circles", "the academies", "amongst scientists"]} as it is ${
            ["hypothesized that", "suggested that", "posited that"]
        } the ${[genTemplate`${Category.Plant} is not actually a plant`, genTemplate`${Category.Animal} is not actually an animal`]}`)
    },
    "archaeology-boost": {
        effect: boost("archaeology", genTemplate`A group of archaeologists have unearthed the ruins of ${
            [genTemplate`the city of ${Category.City}`, genTemplate`the ruins of the ${Category.Building}`]
        }`)
    },
    "flight-boost": {
        effect: boost("flight", genTemplate`A daring adventurer has flown solo ${
            [genTemplate`from ${[Category.City, Category.Region]} to ${[Category.City, Category.Region]}`, "around the world"]
        }`)
    },
    "radio-boost": {
        effect: boost("radio", genTemplate`A radio production of the ${Category.Writing} is produced. ${
            ["People wonder if it captured the original intent", "People wonder how the original author would feel"]
        }`)
    },
    "space-flight-boost": {
        effect: boost("space-flight", genTemplate`${["A manned mission", "An unmanned probe"]} is sent to ${Category.CelestialBody}, ${
            ["much is learned from the endeavor", "mankind has long looked up at this distant world"]
        }`)
    },
    // completion
    "world-government": {
        effect: combine(
            sendMessage(genTemplate`The entire world is now united under a single government, even rivals like ${Category.Region} and ${Category.Region} are united, conflict is no more`),
            changeProbabilities({"conflict": -1, "nuclear-war": -1, "world-government": -1})
        )
    },
    "probe": {
        effect: combine(
            sendMessage(genTemplate`${TEMPLATES.PEOPLE} have sent a probe that will leave this system, included is ${[
                genTemplate`the entire text of ${Category.Writing}`, genTemplate`the DNA sequence of ${[Category.Plant, Category.Animal]}`,
            ]}. Who will find it? And what will they think?`),
            markWin()
        )
    }
};

const START_PROBABILITIES = {
    "learn-tech": 0.001,
    "volcano": 0.001,
    "astroid": 0.001,
    "plague": 0.002,
    "famine": 0.003,
    "conflict": 0.003
};

export class EventManager {
    private probabilities: Map<string, number>;

    constructor() {
        this.probabilities = new Map();
        for (const [name, probability] of Object.entries(START_PROBABILITIES)) {
            this.probabilities.set(name, probability);
        }
    }

    public pickEvent(): Event | undefined {
        let names = Array.from(this.probabilities.keys());
        shuffle(names);
        for (let name of names) {
            if (Math.random() < (this.probabilities.get(name) ?? 0)) {
                return EVENTS[name];
            }
        }
        return undefined;
    }

    public setProbability(name: string, value: number): void {
        this.probabilities.set(name, (this.probabilities.get(name) ?? 0) + value);
    }

    public setProbabilities(probabilities: Record<string, number>, reverse: boolean = false): void {
        Object.entries(probabilities).forEach(([name, value]) => {
            this.setProbability(name, reverse ? -value : value);
        });
    }
}

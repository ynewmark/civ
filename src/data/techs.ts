import { Category } from "./language";
import { genTemplate, Template, TEMPLATES } from "./message";
import { pickOne } from "./utils";

export type Tech = {
    prereqs: string[],
    eventChanges: Record<string, number>,
    message: Template
}

const TECHS: Record<string, Tech> = {
    "fire": {
        prereqs: [],
        eventChanges: {"conflict": 0.002},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} make fire by ${
            [genTemplate`rubbing two pieces of ${Category.Plant} together`, genTemplate`striking a piece of ${Category.Mineral}`]
        }, they${TEMPLATES.MAINLY} use it ${["to cook", "for light", "for warmth"]}`
    },
    "writing": {
        prereqs: [],
        eventChanges: {"writing-boost": 0.01, "learn-tech": 0.005},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} write, they${TEMPLATES.MAINLY} write on
            ${[genTemplate`${Category.Mineral} tablets`, genTemplate`a paper made from the ${Category.Plant} plant`]
        }, they${TEMPLATES.MAINLY} use it ${["for record keeping", "to tell stories"]}`
    },
    "mining": {
        prereqs: [],
        eventChanges: {},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["extract", "mine", "remove"]} minerals including ${Category.Mineral} from ${
            ["the ground", "the soil", "the earth", genTemplate`the bowels of ${Category.Planet}`]
        }`
    },
    "agriculture": {
        prereqs: [],
        eventChanges: {"famine": -0.001},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["farm", "grow crops"]}, their primary crop is ${Category.Plant}`
    },
    "animal-husbandry": {
        prereqs: ["agriculture"],
        eventChanges: {"famine": -0.002, "plague": 0.001},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} domesticate animals, including the ${Category.Animal} which they use ${[
            "as a source of meat", "as a beast of burden", "to help them hunt"
        ]}`
    },
    "astronomy": {
        prereqs: [],
        eventChanges: {"astronomy-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} begin to look to the heavens and the celestial bodies within`
    },
    "metalworking": {
        prereqs: ["fire", "mining"],
        eventChanges: {"conflict": 0.002},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} make tools with metals, they${TEMPLATES.MAINLY} use ${Category.Mineral} ore`
    },
    "construction": {
        prereqs: ["agriculture", "animal-husbandry"],
        eventChanges: {"plague": 0.002, "conflict": -.001, "construction": 0.002, "city-formation": 0.002, "religion": 0.002},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "construct"]} permanent structures, they${TEMPLATES.MAINLY} make them out of ${
            [genTemplate`${Category.Plant} wood`, genTemplate`${Category.Mineral}`]
        }`
    },
    "sailing": {
        prereqs: ["astronomy"],
        eventChanges: {"plague": 0.002, "sailing-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} build simple boats to sail to new lands`
    },
    "mathematics": {
        prereqs: ["writing"],
        eventChanges: {},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} use numbers and figures to model the world`
    },
    "architecture": {
        prereqs: ["mathematics", "construction"],
        eventChanges: {"construction": 0.001, "city-formation": 0.001},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "construct"]} more complex structures`
    },
    "plumbing": {
        prereqs: ["construction", "metalworking"],
        eventChanges: {"plague": -0.003},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "construct"]} pipes to remove waste and maintain cleanliness`
    },
    "mill-power": {
        prereqs: ["metalworking", "sailing"],
        eventChanges: {},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["use", "utilize"]} wind and water to perform work`
    },
    "printing-press": {
        prereqs: ["metalworking", "architecture"],
        eventChanges: {"printing-press-boost": 0.01, "learn-tech": 0.005},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} create machines that could mass-produce books, making them readily available`
    },
    "taxonomy": {
        prereqs: ["printing-press"],
        eventChanges: {"taxonomy-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} have began to catagorize all life within a single system, from the ${Category.Plant} to the ${Category.Animal}`
    },
    "steam-power": {
        prereqs: ["mill-power", "architecture"],
        eventChanges: {},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} create mills powered by steam, they are far more efficient`
    },
    "electricity": {
        prereqs: ["steam-power", "printing-press"],
        eventChanges: {},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} harness the power of electricity to do amazing things`
    },
    "gunnery": {
        prereqs: ["architecture", "metalworking"],
        eventChanges: {"conflict": 0.003},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} create weapons like guns and artillery, conflict has drastically changed`
    },
    "archaeology": {
        prereqs: ["printing-press"],
        eventChanges: {"archaeology-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} begin to excavate ${["old", "ancient"]} ${["cities", "ruins", "buildings"]} to learn about the past`
    },
    "germ-theory": {
        prereqs: ["taxonomy", "plumbing"],
        eventChanges: {"plague": -0.004},
        message: genTemplate`${TEMPLATES.PEOPLE} begin to accept the initially controversial idea that disease is caused by microorganisms, this allows for the adopation of new methods to treat and prevent disease`
    },
    "radio": {
        prereqs: ["electricity"],
        eventChanges: {"radio-boost": 0.01, "world-government": 0.0001},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${
            ["transmit information over", "communicate using"]
        } electrical currents, ${["the world", "the planet", genTemplate`${Category.Planet}`]} has never felt smaller`
    },
    "flight": {
        prereqs: ["electricity"],
        eventChanges: {"flight-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "create"]} heavier than air flying machines, the heavens lose some of their mystery`
    },
    "rocketry": {
        prereqs: ["gunnery"],
        eventChanges: {"conflict": 0.003},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "create"]} rockets, their uses for war are readily apparent`
    },
    "computing": {
        prereqs: ["electricity"],
        eventChanges: {"learn-tech": 0.002},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} ${["build", "create", "construct"]} thinking machines`
    },
    "networked-computing": {
        prereqs: ["radio", "computing", "archaeology"],
        eventChanges: {"learn-tech": 0.002, "world-government": 0.05},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} connect computers to a single network, allowing for unprecedented levels of communication and collaberation`
    },
    "atomic-theory": {
        prereqs: ["gunnery", "computing"],
        eventChanges: {"nuclear-war": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} have ${TEMPLATES.DISCOVERED} use the power of the atom, to what end is to be seen`
    },
    "space-flight": {
        prereqs: ["rocketry", "flight", "computing", "astronomy"],
        eventChanges: {"space-flight-boost": 0.01},
        message: genTemplate`${TEMPLATES.PEOPLE} begin to launch crafts into space`
    },
    "space-exploration": {
        prereqs: ["space-flight", "atomic-theory", "networked-computing"],
        eventChanges: {"probe": 0.1},
        message: genTemplate`${TEMPLATES.PEOPLE} develop crafts that could potentially leave the system`
    }
}

class Tree {
    private succs: Map<string, Set<string>>;

    constructor() {
        this.succs = new Map();
    }

    public addNode(node: string): void {
        this.succs.set(node, new Set());
        TECHS[node].prereqs.forEach((name) => this.succs.get(name)?.add(node));
    }

    public removeNode(node: string): void {
        TECHS[node].prereqs.forEach((name) => this.succs.get(name)?.delete(node));
    }

    public getLeaves(): string[] {
        return [...this.succs.keys()].filter((name) => this.succs.get(name)?.size === 0);
    }
}

export class TechManager {
    private researched: Set<string>;
    private notResearched: Set<string>;
    private tree: Tree

    constructor() {
        this.notResearched = new Set(Object.keys(TECHS));
        this.researched = new Set();
        this.tree = new Tree();
    }

    public getAvailable(): string[] {
        return [...this.notResearched.values()].filter(
            (name) => TECHS[name].prereqs.every((prereq) => this.researched.has(prereq))
        );
    }

    public research(name: string): Tech {
        this.notResearched.delete(name);
        this.researched.add(name);
        this.tree.addNode(name);
        return TECHS[name];
    }

    public unlearnTech(): Tech | undefined {
        let names = this.tree.getLeaves();
        if (names.length > 0) {
            let name = pickOne(names);
            this.researched.delete(name);
            this.notResearched.add(name);
            this.tree.removeNode(name);
            return TECHS[name];
        } else {
            return undefined;
        }
    }
}

import { useEffect, useRef, useState } from "react"
import { TechManager } from "./data/techs"
import { EventManager } from "./data/events";
import { Category, LanguageManager } from "./data/language";
import Footer from "./Footer";
import { START_MESSAGE } from "./data/message";

interface Props {
    date: number
}

function Civ({date}: Props) {

    function researchTech(name: string): void {
        const tech = techManager.research(name);
        eventManager.setProbabilities(tech.eventChanges);
        const message = tech.message.generate(languageManager.getLanguage());
        setMessages((values) => [...values, message])
    }
    const [isWin, setWin] = useState(false);
    const techManager = useRef(new TechManager()).current;
    const eventManager = useRef(new EventManager()).current;
    const languageManager = useRef(new LanguageManager()).current;
    const [messages, setMessages] = useState([START_MESSAGE.generate(languageManager.getLanguage())]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isWin) {
                const event = eventManager.pickEvent();
                if (event) {
                    event.effect(techManager, eventManager, languageManager, (text) => setMessages((values) => [...values, text]), () => setWin(true));
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isWin, eventManager, languageManager, techManager]);

    return <div className="Civ">
        <h3>{languageManager.getLanguage().getWord(Category.Civ, true)}</h3>
        <div>
        {messages.map((message, index) => (
            <p key={index}>{message}</p>
        ))}
        </div>
        <Footer date={date} availableTechs={techManager.getAvailable()} selectTech={researchTech} isWin={isWin}></Footer>
    </div>
}

export default Civ;

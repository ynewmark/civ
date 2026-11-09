import React from "react";
import { useState } from "react"

interface Props {
    date: number,
    availableTechs: string[],
    isWin: boolean,
    selectTech: (tech: string) => void
}

function Footer({date, availableTechs, isWin, selectTech}: Props) {

    const [nextDate, setNextDate] = useState(date);

    return <div>{isWin ?
        "This civilization is now amongst the stars"
    : (date >= nextDate ? <>
        You could teach them {[...availableTechs].sort().map((tech, index) => (
            <React.Fragment key={index}>
                <button type="button" className="link-button" onClick={(e) => {setNextDate(date + 20); selectTech(tech); return false;}}>{tech}</button>
                {index < availableTechs.length - 1 ? ", " : ""}
                {index === availableTechs.length - 2 ? " or " : ""}
            </React.Fragment>
        ))}.
    </> : <>You must wait to choose a new tech until stardate {nextDate}.</>
    )
    }</div>
}

export default Footer;

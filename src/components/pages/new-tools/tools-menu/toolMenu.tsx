import {Fragment, ReactNode, useState} from "react";

import './tools-menu.scss'
import arrow from './arrow-icon.svg'
import {Link} from "react-router-dom";

export default function ToolsMenu() {
    return (<div className={'tools-menu-body'}>
        <ToolCardGroup defaultOpen={true} name={`Формирование отчетности`}>
            <ToolCard name={`Базовый отчет по согласованиям`}
                      description={`Формирование отчета с группировкой по статусу`}
                      url={`/tools/agreements-default`}/>
            <ToolCard name={`Расширенный отчет по согласованиям`}
                      description={`Формирование отчета с группировкой по статусу за период`}
                      url={`/tools/agreements-detailed`}/>
            <ToolCard name={`Расширенный отчет по блокировкам`}
                      description={`Формирование отчета блокировок за период`}
                      url={`/tools/blocklist-detailed`}/>
        </ToolCardGroup>
        <ToolCardGroup defaultOpen={true} name={`Списки блокировок`}>
            <ToolCard name={`Регулярные блокировки`}
                      description={`Формирование списков блокировок отсутствующих сотрудников`}
                      url={`/tools/blocklist-regular`}/>
            <ToolCard name={`Блокирование пользователей`}
                      description={`Формирование списков блокировок согласно по списку пользователей`}
                      url={`/tools/blocklist-security`}/>
        </ToolCardGroup>
    </div>)
}

interface IToolCardGroupProps {
    name: string
    children: ReactNode
    defaultOpen: boolean
}

function ToolCardGroup(props: IToolCardGroupProps) {
    const [isOpen, setIsOpen] = useState<boolean>(props.defaultOpen)

    return (<div className={'tool-cards-group'}>
        <div className={'tool-cards-group_header'}>
            <h2>{props.name}</h2>
            <img onClick={() => setIsOpen(prevState => {
                return !prevState
            })} className={`open-icon ${isOpen ? 'open' : 'closed'}`} src={arrow} alt="arrow"/>
        </div>
        <ul className={`tool-cards-group_list ${isOpen ? 'open' : 'closed'}`}>
            {props.children}
        </ul>
    </div>)
}

interface IToolCardProps {
    name: string
    url: string
    description: string
}

function ToolCard(props: IToolCardProps) {
    return (<Link to={props.url}>
        <li className={'tool-card'}>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </li>
    </Link>)
}
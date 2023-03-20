import React, {Fragment} from "react";
import {NavLink} from "react-router-dom";

export default function ToolsMenu() {
    document.title = 'Инструменты'

    return (
        <Fragment>
            <header>Доступные инструменты</header>
            <div className={'tools-panel'}>
                {toolGroups.map(group => {
                    return <ToolCardGroup name={group.name} tools={group.tools}/>
                })}
            </div>
        </Fragment>
    )
}

interface IToolCardProps {
    name: string;
    description: string;
    href: string;
    status: 0 | 1 | 2;
}

interface IToolCardGroupProps {
    name: string;
    tools: Array<IToolCardProps>
}

const toolGroups: IToolCardGroupProps[] = [
    {
        name: 'Отчетность',
        tools: [
            {
                name: 'Ежедневный отчет',
                description: 'Создать ежедневный отчет по согласованиям',
                href: '/tools/daily-access',
                status: 2
            },
            {
                name: 'Еженедельный отчет по согласованиям',
                description: 'Создать еженедельный отчет по согласованиям',
                href: '/tools/weekly-access',
                status: 2
            },
            {
                name: 'Еженедельный отчет по блокировкам',
                description: 'Создать еженедельный отчет по блокировкам.',
                href: '/tools/weekly-block',
                status: 2
            },
        ]
    },
    {
        name: 'Списки блокировок',
        tools: [
            {
                name: 'Регулярные блокировки',
                description: 'Заблокировать учетные записи отсутствующих сотрудников согласно списку.',
                href: '/tools/regular-block',
                status: 2
            },
            {
                name: 'Блокировки ДЭБ',
                description: 'Подготовить список УЗ сотрудников к блокировке по обращению ДЭБ.',
                href: '/tools/security-block',
                status: 2
            },
        ]
    },
    {
        name: 'Внешние сотрудники',
        tools: [
            {
                name: 'Массовое добавление',
                description: 'Создать карточки внешних сотрудников согласно списку.',
                href: '/tools/create-foreign-employees',
                status: 0
            },
            {
                name: 'Массовое продление',
                description: 'Продлить срок действия УЗ внешних сотрудников согласно списку.',
                href: '/tools/renew-foreign-employees',
                status: 0
            },
            {
                name: 'Массовая блокировка',
                description: 'Отключить УЗ внешних сотрудников согласно списку.',
                href: '/tools/disable-foreign-employees',
                status: 0
            },
        ]
    }
]

function ToolCard({name, description, href, status}: IToolCardProps) {
    let displayJobNameString: string
    switch (status) {
        case 2:
            displayJobNameString = `🟢 `
            break
        case 1:
            displayJobNameString = `🟠 `
            break
        case 0:
            displayJobNameString = `🔴 `
            break
        default:
            displayJobNameString = `⚪ `
    }

    displayJobNameString += name

    return (
        <Fragment>
            <NavLink to={href}>
                <div className={'tool-card'}>
                    <h3 className={'tool-card__name'}>{displayJobNameString}</h3>
                    <p>{description}</p>
                </div>
            </NavLink>
        </Fragment>
    )
}

function ToolCardGroup({name, tools}: IToolCardGroupProps) {
    return (
        <div className={'tool-card-group'}>
            <h2>{name}</h2>
            <div className="tools-list">
                {tools.map((tool, index) => {
                    return <ToolCard key={index} description={tool.description}
                                     name={tool.name}
                                     href={tool.href}
                                     status={tool.status}/>
                })}
            </div>
        </div>
    )
}
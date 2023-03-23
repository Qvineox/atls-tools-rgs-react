import './navbar.scss';
import {NavLink} from "react-router-dom";

export default function Navbar() {
    return (
        <div id={'navigation-bar'}>
            <nav>
                {/*<NavLink to={'/home'} className={({isActive}) =>*/}
                {/*    isActive ? 'navigation-bar__link_active' : 'navigation-bar__link'*/}
                {/*}>Домашняя страница</NavLink>*/}
                <NavLink to={'/history'} className={({isActive}) =>
                    isActive ? 'navigation-bar__link_active' : 'navigation-bar__link'
                }>История</NavLink>
                <NavLink to={'/tools-menu'} className={({isActive}) =>
                    isActive ? 'navigation-bar__link_active' : 'navigation-bar__link'
                }>Инструменты</NavLink>
                {/*<NavLink to={'/search'} className={({isActive}) =>*/}
                {/*    isActive ? 'navigation-bar__link_active' : 'navigation-bar__link'*/}
                {/*}><i>Поиск</i></NavLink>*/}
                <NavLink to={'/statistics'} className={({isActive}) =>
                    isActive ? 'navigation-bar__link_active' : 'navigation-bar__link'
                }>Статистика</NavLink>
            </nav>
        </div>
    )
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "./components/pages/home";
import Tools from "./components/pages/tools";
import Statistics from "./components/pages/statistics";
import History from "./components/pages/history";
import Search from "./components/pages/search";
import DailyAccessTool from "./components/pages/tools/daily-access";
import Root from "./components/pages/root";
import ToolsMenu from "./components/pages/tools/menu";
import WeeklyAccessTool from "./components/pages/tools/weekly-access";
import SecurityBlockTool from "./components/pages/tools/security-block";
import RegularBlockTool from "./components/pages/tools/regular-block";
import WeeklyBlockTool from "./components/pages/tools/weekly-block";
import Report from "./components/pages/report";
import AddForeignEmployeesTool from "./components/pages/tools/add-foreign-employees";
import {AgreementsDefaultSummaryTool} from "./components/pages/new-tools/agreements/defaultSummaryTool";
import ToolRoot from "./components/pages/new-tools/toolsRoot";
import {AgreementsDetailedSummaryTool} from "./components/pages/new-tools/agreements/detailedSummaryTool";
import {BlockListsDetailedSummaryTool} from "./components/pages/new-tools/blocklists/detailedSummaryTool";
import {BlockListsRegularTool} from "./components/pages/new-tools/blocklists/regularBlockListTool";
import {SecurityBlockListTool} from "./components/pages/new-tools/blocklists/securityBlockListTool";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: "/home",
                element: <Home/>,
            },
            {
                path: '/history',
                element: <History/>,
            },
            {
                path: '/reports/:reportId',
                element: <Report/>,
            },
            {
                path: '/new-tools',
                element: <ToolRoot/>,
                children: [
                    {
                        path: '/new-tools/agreements-default',
                        element: <AgreementsDefaultSummaryTool/>
                    },
                    {
                        path: '/new-tools/agreements-detailed',
                        element: <AgreementsDetailedSummaryTool/>
                    },
                    {
                        path: '/new-tools/blocklist-detailed',
                        element: <BlockListsDetailedSummaryTool/>
                    },
                    {
                        path: '/new-tools/blocklist-regular',
                        element: <BlockListsRegularTool/>
                    },
                    {
                        path: '/new-tools/blocklist-security',
                        element: <SecurityBlockListTool/>
                    }
                ]
            },
            {
                path: '/tools',
                element: <Tools/>,
                children: [
                    {
                        path: '/tools/menu',
                        element: <ToolsMenu/>
                    },
                    {
                        path: '/tools/daily-access',
                        element: <DailyAccessTool/>
                    },
                    {
                        path: '/tools/weekly-access',
                        element: <WeeklyAccessTool/>
                    },
                    {
                        path: '/tools/weekly-block',
                        element: <WeeklyBlockTool/>
                    },
                    {
                        path: '/tools/regular-block',
                        element: <RegularBlockTool/>
                    },
                    {
                        path: '/tools/security-block',
                        element: <SecurityBlockTool/>
                    },
                    {
                        path: '/tools/create-foreign-employees',
                        element: <AddForeignEmployeesTool/>
                    },
                ]
            },
            {
                path: '/search',
                element: <Search/>,
            },
            {
                path: '/statistics',
                element: <Statistics/>,
            }
        ]
    },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <RouterProvider router={router}/>
    // </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

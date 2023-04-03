import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "./components/pages/home/home";
import Statistics from "./components/pages/statistics/statistics";
import Search from "./components/pages/search/search";
import Root from "./components/pages/root";
import {AgreementsDefaultSummaryTool} from "./components/pages/new-tools/agreements/defaultSummaryTool";
import ToolRoot from "./components/pages/new-tools/toolsRoot";
import {AgreementsDetailedSummaryTool} from "./components/pages/new-tools/agreements/detailedSummaryTool";
import {BlockListsDetailedSummaryTool} from "./components/pages/new-tools/blocklists/detailedSummaryTool";
import {BlockListsRegularTool} from "./components/pages/new-tools/blocklists/regularBlockListTool";
import {SecurityBlockListTool} from "./components/pages/new-tools/blocklists/securityBlockListTool";
import History from "./components/pages/history/history";
import ToolsMenu from "./components/pages/new-tools/tools-menu/toolMenu";
import ReportInfo from "./components/pages/report/reportInfo";
import {TerroristListTool} from "./components/pages/new-tools/security/terroristListTool";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: '/home',
                element: <Home/>,
            },
            {
                path: '/history',
                element: <History/>,
            },
            {
                path: '/reports/:reportId',
                element: <ReportInfo/>,
            },
            {
                path: '/tools-menu',
                element: <ToolsMenu/>
            },
            {
                path: '/tools',
                element: <ToolRoot/>,
                children: [
                    {
                        path: '/tools/agreements-default',
                        element: <AgreementsDefaultSummaryTool/>
                    },
                    {
                        path: '/tools/agreements-detailed',
                        element: <AgreementsDetailedSummaryTool/>
                    },
                    {
                        path: '/tools/blocklist-detailed',
                        element: <BlockListsDetailedSummaryTool/>
                    },
                    {
                        path: '/tools/blocklist-regular',
                        element: <BlockListsRegularTool/>
                    },
                    {
                        path: '/tools/blocklist-security',
                        element: <SecurityBlockListTool/>
                    },
                    {
                        path: '/tools/terrorists',
                        element: <TerroristListTool/>
                    }
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
// reportWebVitals();

import {Fragment} from "react";
import Navbar from "../navigation/navbar";
import {Outlet} from "react-router-dom";

import '../../styles/root.scss'
import 'react-toastify/dist/ReactToastify.min.css';
import {ToastContainer} from "react-toastify";

export default function Root() {
    return <Fragment>
        <Navbar/>
        <div className="page-body">
            <Outlet/>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                theme="light"
            />
        </div>
    </Fragment>
}
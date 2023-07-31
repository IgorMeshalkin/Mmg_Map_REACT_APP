import './App.css';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import MosPage from "./pages/MosPage";
import UsersPage from "./pages/UsersPage";
import MainPage from "./pages/MainPage";
import DataPage from "./pages/DataPage";
import React, {useEffect, useState} from "react";
import AdminPage from "./pages/AdminPage";
import {AuthContext} from "./context/context";

function App() {
    const [isAuth, setIsAuth] = useState(false)
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        if (sessionStorage.getItem('currentUser') !== null) {
            const userFromLocalStorage = JSON.parse(sessionStorage.getItem('currentUser'))
            setCurrentUser(userFromLocalStorage)
            setIsAuth(true)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(currentUser).length > 0) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser')
        }
    }, [currentUser])

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            currentUser,
            setCurrentUser
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/data" element={<DataPage/>}/>
                    <Route path="/users" element={<UsersPage/>}/>
                    <Route path="/mos" element={<MosPage/>}/>
                    <Route path="/*" element={<MainPage/>}/>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;

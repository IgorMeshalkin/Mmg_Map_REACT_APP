import React from 'react';
import YearPlansForm from "./YearPlansForm/YearPlansForm";
import WeekForm from "./WeekForm/WeekForm";
import AuthAndNavigationBar from "../AuthAndNavigationBar/AuthAndNavigationBar";
import "./AdminBoard.css"
import {useNavigate} from "react-router-dom";

const AdminBoard = () => {
    const navigator = useNavigate()

    return (
        <>
            <div className="lightGreyBackground">
                <div className="adminWhiteBackground">
                    <div className="adminPageTitle">Страница администратора</div>
                    <div className="adminFormsContainer">
                        <div className="adminFormContainer">
                            <YearPlansForm/>
                        </div>
                        <div className="adminFormContainer">
                            <WeekForm/>
                        </div>
                    </div>
                    <div className="adminNavigateButtonsContainer">
                        <div className="adminNavigateButtonContainer">
                            <div className="adminNavigateButton"
                                 title="Перейти на страницу управления пользователями"
                                 onClick={() => navigator("/users")}
                            >
                                ПОЛЬЗОВАТЕЛИ
                            </div>
                        </div>
                        <div className="adminNavigateButtonContainer">
                            <div className="adminNavigateButton"
                                 title="Перейти на страницу управления медицинскими организациями"
                                 onClick={() => navigator("/mos")}
                            >
                                МЕДИЦИНСКИЕ ОРГАНИЗАЦИИ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthAndNavigationBar/>
        </>
    );
};

export default AdminBoard;
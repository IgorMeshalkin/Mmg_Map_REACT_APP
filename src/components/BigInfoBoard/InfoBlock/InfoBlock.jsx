import React, {useEffect, useState} from 'react';
import "./InfoBlock.css"
import {logDOM} from "@testing-library/react";

const InfoBlock = ({data, week}) => {
    //тип данных где 1-работа с прикреплённым населением, 2-работа по самостоятельному тарифу
    const [type, setType] = useState()
    //процент выполнения обследований
    const [percentageOfCompletionPerform, setPercentageOfCompletionPerform] = useState()
    //процент выявления патологий
    const [percentageOfCompletionDetect, setPercentageOfCompletionDetect] = useState()
    //список МО для которых выполняется исследование при работе по самостоятельному тарифу
    const [mosForWhichList, setMosForWhichList] = useState()

    //при каждом обновлении данных заново инициирует вышеуказанные состояния.
    useEffect(() => {
        setType(data.Type.Id)
        setPercentageOfCompletionPerform(((data.NumberOfPerformedMammographyByYear / data.YearPlan.Plan) * 100).toFixed(2))
        setPercentageOfCompletionDetect(((data.NumberOfDetectedPathologyByYear / data.NumberOfPerformedMammographyByYear) * 100).toFixed(2))
        if (data.MosForWhichMammographyWasPerformed && data.MosForWhichMammographyWasPerformed.length > 0) {
            setMosForWhichList(data.MosForWhichMammographyWasPerformed)
        }
    }, [data])

    return (
        <div className="iBlockMain">
            <div
                className="iBType">{type === 1 ? "Работа с прикреплённым населением" : "Работа по самостоятельному тарифу"}</div>
            <div className="iBlockContent">

                {
                    type === 1 ?
                        <>
                            {
                                data.MoPerformedMammography &&
                                <div className="iBlockContentMainLineContainer first">
                                    <div className="iBlockContentInnerLineContainer">
                                        <div className="iBlockContentContainer">
                                            <div
                                                className="iBlockTitle">Медицинская организация, выполняющая маммографию:
                                            </div>
                                        </div>
                                    </div>
                                    <div className="iBlockContentSeparator"/>
                                    <div className="iBlockContentInnerLineContainer">
                                        <div className="iBlockContentContainer">
                                            <div className="iBlockValue">{data.MoPerformedMammography.Name}</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </> :
                        <>
                            {
                                mosForWhichList &&
                                <div className="iBlockContentMainLineContainer first">
                                    <div className="iBlockContentInnerLineContainer">
                                        <div className="iBlockContentContainer">
                                            <div
                                                className="iBlockTitle">Медицинские организации для которых выполняются
                                                исследования в рамках работы по самостоятельному тарифу:
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        mosForWhichList.map(i =>
                                        <div key={i.Id}>
                                            <div className="iBlockContentSeparator"/>
                                            <div className="iBlockContentInnerLineContainer">
                                                <div className="iBlockContentContainer">
                                                    <div className="iBlockValue">{i.Name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    }
                                </div>
                            }
                        </>
                }

                <div className={mosForWhichList ? "iBlockContentMainLineContainer" : "iBlockContentMainLineContainer first"}>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">{"План на " + data.YearPlan.Year + " год:"}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">{"Маммограф был в наличии в отчётную неделю?"}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">{"Маммограф работал в отчётную неделю?"}</div>
                        </div>
                    </div>
                    <div className="iBlockContentSeparator"/>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{data.YearPlan.Plan}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className={data.IsMammographAvaliable ? 'iBlockValue green' : 'iBlockValue grey'}>{data.IsMammographAvaliable ? "ДА" : "НЕТ"}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className={data.IsMammographWasWorking ? 'iBlockValue green' : 'iBlockValue grey'}>{data.IsMammographWasWorking ? "ДА" : "НЕТ"}</div>
                        </div>
                    </div>
                </div>

                <div className="iBlockContentMainLineContainer">
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">Число выполненных маммографий</div>
                        </div>
                    </div>
                    <div className="iBlockContentSeparator"/>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">Всего с начала года (нарастающий итог)</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">% выполнения плана года</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">За отчётную неделю</div>
                        </div>
                    </div>
                    <div className="iBlockContentSeparator"/>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{data.NumberOfPerformedMammographyByYear}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className={percentageOfCompletionPerform >= week.Target ? 'iBlockValue green' : 'iBlockValue grey'}>{percentageOfCompletionPerform + "%"}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{data.NumberOfPerformedMammography}</div>
                        </div>
                    </div>
                </div>

                <div className="iBlockContentMainLineContainer">
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">Число случаев с выявлением патологии (по BI-RADS 3 и выше)</div>
                        </div>
                    </div>
                    <div className="iBlockContentSeparator"/>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">Всего с начала года (нарастающий итог)</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">% от выполненных исследований</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockTitle">За отчётную неделю</div>
                        </div>
                    </div>
                    <div className="iBlockContentSeparator"/>
                    <div className="iBlockContentInnerLineContainer">
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{data.NumberOfDetectedPathologyByYear}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{percentageOfCompletionDetect + "%"}</div>
                        </div>
                        <div className="iBlockContentContainer">
                            <div className="iBlockValue">{data.NumberOfDetectedPathology}</div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default InfoBlock;
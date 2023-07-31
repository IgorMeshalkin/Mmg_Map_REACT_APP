import React from 'react';
import "./RadioButtons.css"

const RadioButtons = ({list, selectedItem, setSelectedItem}) => {
    return (
        <div>
            {
                list.map(i =>
                    <div key={i.Id}>
                        <div className="radButLine">
                            <div className={i.Id === selectedItem.Id ? "radButCheckBox shadow" : "radButCheckBox"}
                                 onClick={() => setSelectedItem(i)}>
                                {
                                    i.Id === selectedItem.Id &&
                                    <div className="radButMarker">✔</div>
                                }
                            </div>
                            <div className="radButValue">{i.Value}</div>
                        </div>
                        {
                            list.indexOf(i) !== list.length - 1 &&
                            <br/>
                        }
                    </div>
                )
            }
        </div>
    );
};

export default RadioButtons;
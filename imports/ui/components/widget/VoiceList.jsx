import React from 'react';

export default (prop) => {
    let willShow = (prop.isOpen) ? "" : "hidden";
    return (
        <div id="widgetBox_1" className={willShow}>
            <div id="voiceListBox_2">
                <div id="voiceListBox_3">
                    <div id="voiceListBox_4">
                        Voice Channel
                    </div>
                    <div id="voiceListBox_5">
                        <div id="voiceListBox_6">
                            
                        </div>
                    </div>
                    <div id="voiceListBox_7" onClick={() => {prop.toggleWidget('close/open')}}>
                        <div id="voiceListBox_8">
                            X
                        </div>
                    </div>
                </div>
                <div id="voiceListBox_9">
                    <div id="voiceListBox_10" onClick={() => {prop.toggleWidget('ctc', 'voice')}}>
                        <div id="voiceListBox_11">
                            Click To Call
                        </div><img src="/img/widget---06.svg" id="IMG_12" alt='' />
                    </div>
                    <div id="voiceListBox_13" onClick={() => {prop.toggleWidget('gac', 'voice')}}>
                        <div id="voiceListBox_14">
                            Get A CallBack
                        </div><img src="/img/widget---07.svg" id="IMG_15" alt='' />
                    </div>
                    <div id="voiceListBox_16" onClick={() => {prop.toggleWidget('ctd', 'voice')}}>
                        <div id="voiceListBox_17">
                            Click To Dial
                        </div><img src="/img/widget---08.svg" id="IMG_18" alt='' />
                    </div>
                    <div id="voiceListBox_19" onClick={() => {prop.toggleWidget('sntc', 'voice')}}>
                        <div id="voiceListBox_20">
                            Show Number To Call
                        </div><img src="/img/widget---09.svg" id="IMG_21" alt='' />
                    </div>
                </div>
                <div id="voiceListBox_22" onClick={() => {prop.toggleWidget('close/open')}}>
                    <div id="voiceListBox_23">
                        Close widget
                    </div>
                    <div id="voiceListBox_24">
                        <div id="voiceListBox_25">
                            X
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';

export default (prop) => {
    let willShow = (prop.isOpen) ? "" : "hidden";
    return (
        <div id="widgetBox_1" className={willShow}>
            <div id="widgetBox_2">
                <div id="widgetBox_3">
                    <div id="widgetBox_4">
                        <div id="widgetBox_5">
                            Reach us through these channels?
                        </div>
                        <div id="widgetBox_6">
                        </div>
                        <div id="widgetBox_7">
                        </div>
                    </div>
                    <div id="widgetBox_8">
                        <div id="widgetBox_9">
                            <div id="widgetBox_10" onClick={() => {prop.toggleWidget('voice')}}>
                                Voice
                            </div><img src="/img/widget----02.svg" id="IMG_11" alt="" />
                        </div>
                        <div id="widgetBox_12">
                            <div id="widgetBox_13">
                                Video
                            </div><img src="/img/widget----01.svg" id="IMG_14" alt="" />
                        </div>
                        <div id="widgetBox_15">
                            <div id="widgetBox_16">
                                Messaging
                            </div><img src="/img/widget----03.svg" id="IMG_17" alt="" />
                        </div>
                        <div id="widgetBox_18">
                            <div id="widgetBox_19">
                                email
                            </div><img src="/img/widget----04.svg" id="IMG_20" alt="" />
                        </div>
                        <div id="widgetBox_21">
                            <div id="widgetBox_22">
                                social
                            </div><img src="/img/widget----05.svg" id="IMG_23" alt="" />
                        </div>
                    </div>
                    <div id="widgetBox_24" onClick={() => {prop.toggleWidget('close/open')}}>
                        <div id="widgetBox_25">
                            Close widget
                        </div>
                        <div id="widgetBox_26">
                            <div id="widgetBox_27">
                                X
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

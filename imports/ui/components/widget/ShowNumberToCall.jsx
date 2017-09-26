import React from 'react';

export default (prop) => {
    let willShow = (prop.isOpen) ? "" : "hidden";
    return (
        <div className={"gacListBox_1 " + willShow}>
            <div className="gacListBox_2">
                <div className="gacListBox_3">
                    Show Number To Call
                </div>
                <div className="gacListBox_4">
                    <div className="gacListBox_5">
                        
                    </div>
                </div>
                <div className="gacListBox_6">
                    <div className="gacListBox_7">
                        
                    </div>
                </div>
            </div>
            <div className="gacListBox_8">
                <div className="gacListBox_9">
                    <div className="gacListBox_10">
                        <div className="gacListBox_11">
                            000
                        </div>
                    </div>
                    <div className="gacListBox_12">
                        <div className="gacListBox_13">
                            <div className="gacListBox_14">
                                <div className="gacListBox_15">
                                    1
                                </div>
                                <div className="gacListBox_16">
                                    .
                                </div>
                            </div>
                            <div className="gacListBox_17">
                                <div className="gacListBox_18">
                                    2
                                </div>
                                <div className="gacListBox_19">
                                    ABC
                                </div>
                            </div>
                            <div className="gacListBox_20">
                                <div className="gacListBox_21">
                                    3
                                </div>
                                <div className="gacListBox_22">
                                    def
                                </div>
                            </div>
                            <div className="gacListBox_23">
                                <div className="gacListBox_24">
                                    4
                                </div>
                                <div className="gacListBox_25">
                                    ghi
                                </div>
                            </div>
                            <div className="gacListBox_26">
                                <div className="gacListBox_27">
                                    5
                                </div>
                                <div className="gacListBox_28">
                                    jkl
                                </div>
                            </div>
                            <div className="gacListBox_29">
                                <div className="gacListBox_30">
                                    6
                                </div>
                                <div className="gacListBox_31">
                                    mno
                                </div>
                            </div>
                            <div className="gacListBox_32">
                                <div className="gacListBox_33">
                                    7
                                </div>
                                <div className="gacListBox_34">
                                    pqrs
                                </div>
                            </div>
                            <div className="gacListBox_35">
                                <div className="gacListBox_36">
                                    8
                                </div>
                                <div className="gacListBox_37">
                                    tuvw
                                </div>
                            </div>
                            <div className="gacListBox_38">
                                <div className="gacListBox_39">
                                    9
                                </div>
                                <div className="gacListBox_40">
                                    xyz
                                </div>
                            </div>
                            <div className="gacListBox_41">
                                <div className="gacListBox_42">
                                    *
                                </div>
                                <div className="gacListBox_43">
                                    .
                                </div>
                            </div>
                            <div className="gacListBox_44">
                                <div className="gacListBox_45">
                                    0
                                </div>
                                <div className="gacListBox_46">
                                    +
                                </div>
                            </div>
                            <div className="gacListBox_47">
                                <div className="gacListBox_48">
                                    #
                                </div>
                                <div className="gacListBox_49">
                                    .
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gacListBox_50">
                        <div className="gacListBox_51">
                            This is your Business Number
                        </div>
                    </div>
                </div>
            </div>
            <div className="gacListBox_52" onClick={() => {prop.toggleWidget('close/open')}}>
                <div className="gacListBox_53">
                    Close widget
                </div>
                <div className="gacListBox_54">
                    <div className="gacListBox_55">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

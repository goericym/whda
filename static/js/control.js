function tshowDiv(id) {
    // If your value is `Select`, then hide your element
    // console.log(id);
    if (sw == 'off') {
        document.getElementById(id).style.display = "none";
    }
    else {
        document.getElementById(id).style.display = "block";
    }
}

var ID_arr = ['Info_tabs', 'SWUpgrade', 'Cust_tabs', 'VehicleTest', 'TestRecode', 'Print', 'SWUpgradeMsgBox'];
function showDiv(idname) {
    for (i = 0; i < ID_arr.length; i++) {
        var value = ID_arr[i];
        if (idname === value) {
            document.getElementById(value).style.display = "block";
        }
        else {
            document.getElementById(value).style.display = "none";
        }
    }
}


//拉條輸入框事件
$(document).ready(function () {
    $("[type=number]").on('keyup', function () {
        var newv = $(this).val();
        //console.log(newv);
        var id = $(this).attr("id");
        if (!$.isNumeric(newv)) {
            // console.log('eeeee');
            $(this).val(0);
            newv = 0;
        }
        $('#' + id + '_Slider').val(newv);
    });
});
//拉條事件
$(document).ready(function () {
    $("[type=range]").on('change mousemove', function () {
        var newv = $(this).val();
        var Name = $(this).attr("name");
        // console.log(Name);
        $(this).next().text(newv);
        $('#' + Name).val(newv);
    });
});





function VTD_P1_OK() {
    DLbtnChk.close()
    DLbtnChk.DLinit('LCD Segment Scan Correct?');
    DLbtnChk.open()
    DLbtnChk.btnOKAction(VTD_P2_OK);
    DLbtnChk.btnNGAction(VTD_P2_NG);
    DLbtnChk.btnDisable()
    setTimeout(function () {
        DLbtnChk.btbEnable()
    }, 2000);
    $('#TestDisplay').html('Testing');
    ManuallySendCmd('{"VehicleTest":"Display_Part2"}');
}
function VTD_P1_NG() {
    $('#TestDisplay').html('Fail');
    var res = 'ErrorCode_0100.pdf'
    $('#TestDisplay_ErrorCode').html(res);
    $('#TestDisplay_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    ManuallySendCmd('{"VehicleTest":"Display_Part1_NG"}');
    DLbtnChk.close()
}
function VTD_P2_OK() {
    DLbtnChk.close()
    DLbtn.DLinit('<table class="table table-striped"><tr><td>Down</td><td id="tid0">Please Press</td></tr><tr><td>Up</td><td id="tid1">Please Press</td></tr><tr><td>Light</td><td id="tid2">Please Press</td></tr><tr><td>Info</td><td id="tid3">Please Press</td></tr></table>');
    DLbtn.open()
    DLbtn.btnAction(VTD_P3_OK);
    DLbtn.btnDisable();
    DLbtn.btnLabel('OK(45)');
    ManuallySendCmd('{"VehicleTest":"Display_Part3"}');

}
function VTD_P3_OK() {
    DLbtn.close()
}
function Display_Part3Check(param) {
    var jsonObj = JSON.parse(param);
    var i = jsonObj.VTD_Button

    if (typeof i != 'undefined') {
        $('#tid' + i).html('Detected');
    }
    if (typeof jsonObj.VTD_Timer != 'undefined') {
        var countdown = 45 - jsonObj.VTD_Timer
        DLbtn.btnLabel('OK(' + countdown + ')')
    }

    var res = jsonObj.VTD_Result
    if (res === 'Pass' || res === 'Fail') {
        DLbtn.btbEnable();
        DLbtn.btnLabel('OK')
        myTimer = setInterval(AutoSend, 2000)
        $('#TestDisplay').html(res);
    }
    if (res === 'Fail') {
        var res = 'ErrorCode_0098.pdf'
        $('#TestDisplay_ErrorCode').html(res);
        $('#TestDisplay_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }


}
function VTD_P2_NG() {
    $('#TestDisplay').html('Fail');
    ManuallySendCmd('{"VehicleTest":"Display_Part2_NG"}');
    DLbtnChk.close()
    var res = 'ErrorCode_0100.pdf'
    $('#TestDisplay_ErrorCode').html(res);
    $('#TestDisplay_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
}
function TestDisplay() {
    DLbtnChk.DLinit('LCD Panel All ON/OFF Correct?');
    DLbtnChk.open()
    DLbtnChk.btnOKAction(VTD_P1_OK);
    DLbtnChk.btnNGAction(VTD_P1_NG);
    DLbtnChk.btnDisable()
    setTimeout(function () {
        DLbtnChk.btbEnable()
    }, 2000);
    $('#TestDisplay_ErrorCode').html('');
    $('#TestDisplay').html('Testing');

    ManuallySendCmd('{"VehicleTest":"Display_Part1"}');
}

function TestDisplay1End(param) {
    DLbtnChk.close()
    var jsonObj = JSON.parse(param);
    $('#TestDisplay').html(jsonObj.VTD_LCD_PNL_On);
}
function TestDisplay2End(param) {
    DLbtnChk.close()
    var jsonObj = JSON.parse(param);
    $('#TestDisplay').html(jsonObj.VTD_LCD_PNL_Off);
}
function TestDisplay2() {
    ManuallySendCmd('{"VehicleTest":"Display2"}');
}

function TestDisplay3() {
    ManuallySendCmd('{"VehicleTest":"Display"}');
}
function TestLight(param) {
    if (typeof param != 'undefined') {
        // $("#test2").attr("disabled", true);
        TLCount = 0;
        DLmsg.DLinit('Test Light start');
        DLmsg.open();
        $('#TestLight_ErrorCode').html('');
        $('#TestLight').html('Testing');
    }
    ManuallySendCmd('{"VehicleTest":"Light"}');
}

function doTestLight(param) {
  var jsonObj = JSON.parse(param);
  var res = jsonObj.VehicleTestLight;
  if (TLCount >= 3) {
    doTestLightFinish(res);
    return true;
  }

  if (res === 'Pass') {
    TLCount++;
    DLmsg.setMsg('Test Light : ' + TLCount);
    setTimeout(TestLight, 1000);
    return true;
  }
  else {
    doTestLightFinish(res);
    return false;
  }
}
function doTestLightFinish(param) {

  // $("#test2").attr("disabled", false);
  DLmsg.close()
  myTimer = setInterval(AutoSend, 2000)
  if (param === 'Pass') {
    $('#TestLight').html('Pass')
  } else {
    $('#TestLight').html('Fail')
    $('#TestLight_ErrorCode').html(param);
    $('#TestLight_ErrorCode').attr('onclick', "PDFFile('" + param + "')");
  }

  // DLmsg.setMsg('Test Light : Finish');
}

function TestDriver() {
    DLmsg.DLinit('Test Driver');
    DLmsg.open()
    $('#TestDriver').html('Testing');
    ManuallySendCmd('{"VehicleTest":"Driver"}');

}
function TestDriverEnd(param) {
    DLmsg.close()
    var jsonObj = JSON.parse(param);
    var res = jsonObj.VehicleTestDriver
    if (res === 'Pass') {
        $('#TestDriver').html('Pass');
    } else {
        $('#TestDriver').html('Fail');
        $('#TestDriver_ErrorCode').html(res);
        $('#TestDriver_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }
}
function TestCadenceSensor() {
    DLbtn.DLinit('VehicleTest TestCadenceSensor');
    DLbtn.open();
    DLbtn.btnDisable();
    DLbtn.btnAction(btnClose);
    DLbtn.btnLabel('OK(30)');
    $('#TestCadenceSensor').html('Testing');
    $('#TestCadenceSensor_ErrorCode').html('');
    ManuallySendCmd('{"VehicleTest":"CadenceSensor"}');

}
function CadenceSensorCheck(param) {
    var jsonObj = JSON.parse(param);
    if (typeof jsonObj.RPM != 'undefined') {
        DLbtn.setMsg('Please Roll the Crank ! RPM :' + jsonObj.RPM);
        var countdown = 30 - jsonObj.Count;
        DLbtn.btnLabel('OK(' + countdown + ')');
    }

    if (jsonObj.TestMaxRPM === 'Pass' || jsonObj.TestMaxRPM === 'Fail') {
        myTimer = setInterval(AutoSend, 2000);
        DLbtn.btbEnable();
        $('#TestCadenceSensor').html(jsonObj.TestMaxRPM);
        DLbtn.btnLabel('OK');
    }

    if (jsonObj.TestMaxRPM === 'Fail') {
        $('#TestCadenceSensor').html('Fail');
        var res = 'ErrorCode_0049.pdf';
        $('#TestCadenceSensor_ErrorCode').html(res);
        $('#TestCadenceSensor_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }


}
function btnClose() {
    DLbtn.close();
}

function TestSpeedSensor() {

    DLmsg.DLinit('VehicleTest TestSpeedSensor');
    DLmsg.open()
    $('#TestSpeedSensor').html('Testing');
    $('#TestSpeedSensor_ErrorCode').html('');
    ManuallySendCmd('{"VehicleTest":"SpeedSensor"}');

}
function TestSpeedSensorEnd(param) {
    DLmsg.close()
    var jsonObj = JSON.parse(param);
    var res = jsonObj.VehicleTestSpeedSensor
    if (res === 'Pass') {
        $('#TestSpeedSensor').html('Pass');
    } else {
        $('#TestSpeedSensor').html('Fail');
        $('#TestSpeedSensor_ErrorCode').html(res);
        $('#TestSpeedSensor_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }

}
function TestMotor() {
    DLmsg.DLinit('VehicleTest Motor');
    DLmsg.open()
    $('#TestMotor').html('Testing');
    $('#TestMotor_ErrorCode').html('');
    ManuallySendCmd('{"VehicleTest":"Motor"}');

}
function TestMotorEnd(param) {
    DLmsg.close()
    var jsonObj = JSON.parse(param);
    var res = jsonObj.VehicleTestMotor
    if (res === 'Pass') {
        $('#TestMotor').html('Pass');
    } else {
        $('#TestMotor').html('Fail');
        $('#TestMotor_ErrorCode').html(res);
        $('#TestMotor_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }
}
function TestBattery() {
    DLmsg.DLinit('VehicleTest Battery');
    DLmsg.open()
    $('#TestBattery').html('Testing');
    $('#TestBattery_ErrorCode').html('');
    ManuallySendCmd('{"VehicleTest":"Battery"}');
}
function TestBatteryEnd(param) {
    DLmsg.close()
    var jsonObj = JSON.parse(param);
    var res = jsonObj.VehicleTestBattery
    if (res === 'Pass') {
        $('#TestBattery').html('Pass');
    } else {
        $('#TestBattery').html('Fail');
        $('#TestBattery_ErrorCode').html(res);
        $('#TestBattery_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }
}
function PREFERENCE_Mode(param) {

    var arr = ['CITY', 'MCLIMBING', 'TREKKING']

    for (i = 0; i < arr.length; i++) {
        var S = 'Images/Preference_' + arr[i] + '_S.png'
        var I = 'Images/Preference_' + arr[i] + '_I.png'
        if (param === arr[i]) {
            if ($('#Preference' + param).attr('src') === S) {
                $('#Preference' + param).attr('src', I);
            }
            else {
                $('#Preference' + param).attr('src', S);
            }
        } else {
            $('#Preference' + arr[i]).attr('src', I);
        }
    }

}
function CustomizeData() {

    var jdata = {
        'm_BikeID': $('input[id=USER_BIKE_ID]').val(),
        "m_DealerName": $('input[id=DELR_NAME]').val(),
        "m_DealerTel": $('input[id=DELR_TEL_NUM]').val(),
        "m_cb_Disable_IsChecked": $('#PNL_MAN_DIST_SW').is(":checked"),
        "m_LastMaintenanceODO": parseFloat($('input[id=PNL_LMAN_DIST]').val()),
        "m_MaintenanceODO": parseFloat($('input[id=PNL_MAN_DIST]').val()),
        "m_AutoSleepTime": parseFloat($('input[id=PNL_ASLP_TIME]').val()),
        "m_WheelDiameter": parseFloat($('input[id=MISC_WEL_DIAM]').val()),
    }
    var jstr = JSON.stringify(jdata)

    var jstrcmd = '{"WriteCustomize" : ' + jstr + '}'

    // console.log(aa)
    // console.log(jjj)
    return jstrcmd;
}
function CustomizeApply() {
    var jstr = CustomizeData();
    // console.log(jstr);
    ManuallySendCmd(jstr);

    DLmsg.setMsg('Write please wait');
    DLmsg.open();
}
function jsondata(params) {
    var jdata = {
        'data1': "1234",
        "data2": 5678,
        "data3": params
    }
    jdata.data1 = "1122"
    return JSON.stringify(jdata);
    //length
}
function PDFFile(params) {

    var el = ' <object id="printObj" class="col-sm-9" height="950" data="test.pdf" type="application/pdf">'
    if (params !== 'Print') {
        el = ' <object id="printObj" class="col-sm-9" height="950" data="ErrorCodeInstruction/' + params + '" type="application/pdf">'
    }
    $('#Print').html(el)
    showDiv('Print');
}
//http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + 300000);//exDays * 24 * 60 * 60 * 1000
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function PrintSet(params) {
    // DoInfo();
    var Display_PRD_SW_VER = $('#PRD_SW_VER').val();
    console.log(Display_PRD_SW_VER)
    setCookie("Display_PRD_SW_VER", Display_PRD_SW_VER)
    var Display_FAC_ACU_DIST = $('#FAC_ACU_DIST').val();
    console.log(Display_FAC_ACU_DIST)
    setCookie("Display_FAC_ACU_DIST", Display_FAC_ACU_DIST)
    var Display_FAC_ACU_TIME = $('#FAC_ACU_TIME').val();
    console.log(Display_FAC_ACU_TIME)
    setCookie("Display_FAC_ACU_TIME", Display_FAC_ACU_TIME)
    var Driver_PRD_SW_VER = $('#Driver_PRD_SW_VER').val();
    console.log(Driver_PRD_SW_VER)
    setCookie("Driver_PRD_SW_VER", Driver_PRD_SW_VER)
    window.open('print.html', '_blank')
}
function PrintLoad() {
    var Display_PRD_SW_VER = getCookie("Display_PRD_SW_VER");
    $('#Display_PRD_SW_VER').html(Display_PRD_SW_VER);
    var Display_FAC_ACU_DIST = getCookie("Display_FAC_ACU_DIST");
    $('#Display_FAC_ACU_DIST').html(Display_FAC_ACU_DIST);
    var Display_FAC_ACU_TIME = getCookie("Display_FAC_ACU_TIME");
    $('#Display_FAC_ACU_TIME').html(Display_FAC_ACU_TIME);
    var Driver_PRD_SW_VER = getCookie("Driver_PRD_SW_VER");
    $('#Driver_PRD_SW_VER').html(Driver_PRD_SW_VER);
    $('#NowTime').html(NowTimeFormat())
}
function NowTimeFormat() {
    var n = new Date();
    var dy = n.getFullYear();
    var dm = n.getMonth() + 1;
    var dd = n.getDate();
    var dh = n.getHours();
    var dmin = n.getMinutes();
    var dsec = n.getSeconds();
    return dy + '-' + dm + '-' + dd + ' ' + dh + ':' + dmin + ":" + dsec;
}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month_s = months[a.getMonth()];
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
var fw_str = '';
function Upgrade_FW(param) {
    fw_str = param;

    var valeur = 0;

    $('[id=bar_' + fw_str + '_FW]').hide();
    $('#btn_' + fw_str + '_FW').attr("disabled", true);
    $('[id=bar_' + fw_str + '_FW]').css('width', valeur + '%').attr('aria-valuenow', valeur);
    var fwcmd = ''
    if (fw_str === 'Console') {
        fwcmd = '{"UpgradeFW":"Display;static/fw/Hippo_Console_20160606_APP.txt;002"}'
    } else if (fw_str === 'LCD_Display') {
        fwcmd = '{"UpgradeFW":"Panel;static/fw/Hippo_Display_20160427_APP.txt;002"}'
    } else if (fw_str === 'Driver') {
        fwcmd = '{"UpgradeFW":"Driver;static/fw/Hippo_Driver_20160607_ETH_1607_APP.txt;002"}'
    }
    console.log(fwcmd)
    setTimeout(function () {
        $('[id=bar_' + fw_str + '_FW]').show();
        // ManuallySendProgressBar('{"DownloadFW":"http://127.0.0.1:9001/Display_20160426.txt;Display_FW.txt"}');
        ManuallySendProgressBar(fwcmd);
    }, 300);

}
function UpgradeFWCheck(param) {
    var jsonObj = JSON.parse(param);
    console.log(jsonObj);

    var valeur = jsonObj.UpgradeFW;
    console.log('v:' + valeur)

    $('[id=bar_' + fw_str + '_FW]').css('width', valeur + '%').attr('aria-valuenow', valeur);
    $('[id=bar_Upgrade]').css('width', valeur + '%').attr('aria-valuenow', valeur);
    if (param === '{"UpgradeFW":"Finish"}') {
        //一問多答結束
        myTimer = setInterval(AutoSend, 2000)
        $('#btn_' + fw_str + '_FW').attr("disabled", false);
        DLbtn.btbEnable();
        fw_str = '';
    }
}
function UpgradeMsg() {


    var MsgHtml = $('#SWUpgradeMsgBox').html()
    var Msg = $('<div></div>').append(MsgHtml)

    console.log(Msg);
    DLbtn.DLinit('init');
    DLbtn.setMsg(Msg);
    DLbtn.btnOnHide(bar_Upgrade_Show(0));
    DLbtn.open();
    DLbtn.btnAction(btnClose);

    DLbtn.btnDisable();



}

function bar_Upgrade_Show(param) {
    var valeur = param;
    console.log(param);
    $('[id=bar_Upgrade]').hide()
    $('[id=bar_Upgrade]').css('width', valeur + '%').attr('aria-valuenow', valeur);
    setTimeout(function () {
        $('[id=bar_Upgrade]').show()
        $('[id=bar_Upgrade]').css('width', valeur + '%').attr('aria-valuenow', valeur);
    }, 500);

}



function DoTestRecode() {
    DLmsg.DLinit('');
    DLmsg.setMsg('Get TestHistory please wait');
    DLmsg.open();
    ManuallySendCmd('{"TestHistory":"None"}');
}

function DoCust() {
    var isReadDisplay = getCookie('ckIsReadDP');
    if (isReadDisplay !== 'True') {
        DLmsg.DLinit('');
        DLmsg.setMsg('Get Customization please wait');
        DLmsg.open();
        ManuallySendCmd('{"Read":"Display"}');
    }

}

function DoPNL_MAN_DIST() {
    var isSelected = $('#PNL_MAN_DIST_SW').is(":checked");
    $('#PNL_MAN_DIST_Slider').attr("disabled", isSelected)
    $('#PNL_MAN_DIST').attr("disabled", isSelected)

}
function TestBT() {
    DLmsg.DLinit('');
    DLmsg.setMsg('test bt');
    DLmsg.open();
    $('#TestBT').html('Testing');
    $('#TestBT_ErrorCode').html('');
    ManuallySendCmd('{"VehicleTest":"BT"}');
}
function TestBTEnd(param) {
    DLmsg.close()
    var jsonObj = JSON.parse(param);
    var res = jsonObj.VehicleTestBT
    if (res === 'Pass') {
        $('#TestBT').html('Pass');
    } else {
        $('#TestBT').html('Fail');
        $('#TestBT_ErrorCode').html(res);
        $('#TestBT_ErrorCode').attr('onclick', "PDFFile('" + res + "')");
    }

}
// $('#TRTestBT').after('<tr></tr>').hide();


function testbtn() {
    // ManuallySendCmd('{"GetFWVer":""}');
    // ManuallySendCmd('{"UpgradeFW":"Display;Display_20160426.txt;566"}');
    //$get 可以改成其他網頁路徑API(只要是吐出json 格式就好)
    // $.get("../../fwver.txt", function (data) {
    //     var jsonObj = JSON.parse(data);
    //     console.log(jsonObj)
    //     alert(jsonObj.ConsoleVer);
    // });
    var MsgHtml = $('#SWUpgradeMsgBox').html()
    var Msg = $('<div></div>').append(MsgHtml)


    DLbtn.DLinit('init');
    DLbtn.setMsg(Msg);
    DLbtn.btnOnShow(bar_Upgrade_Show(0));
    DLbtn.btnOnHide(bar_Upgrade_Show(0));
    DLbtn.open();
    DLbtn.btnAction(btnClose);



}

function testbtn1() {
    var MsgHtml = $('#SWUpgradeMsgBox').html()
    var Msg = $('<div></div>').append(MsgHtml)


    DLbtn.DLinit('init');
    DLbtn.setMsg(Msg);
    DLbtn.btnOnShow(bar_Upgrade_Show(50));
    DLbtn.btnOnHide(bar_Upgrade_Show(0));
    DLbtn.open();
    DLbtn.btnAction(btnClose);

}

function DoCheckFW() {
    //1.先去抓clinet的版本
    ManuallySendCmd('{"GetFWVer":""}');
}
function DoCheckFWPart1(param) {
    var client_jsonObj = JSON.parse(param);
    //$get 可以改成其他網頁路徑API(只要是吐出json 格式就好)
    $.get("../../fwver.txt", function (data) {
        var server_jsonObj = JSON.parse(data);
        console.log(server_jsonObj.ConsoleVer);
        console.log(client_jsonObj.ConsoleVer);
        var s1 = server_jsonObj.ConsoleVer
        var c1 = client_jsonObj.ConsoleVer
        if (s1 > c1) {
            // alert('gggg')
            $('#id_Console_FW').show();
        }


    });

}
function DoInfo() {
    var isReadAll = getCookie('ckIsReadALL')
    console.log('isReadAll:' + isReadAll)
    var sCmd = ""
    if (isReadAll !== 'True') {
        sCmd = '{"Read":"All"}';
        setCookie('ckIsReadALL', 'True');
    } else {
        sCmd = '{"OnlyRead":"All"}';
    }

    DLmsg.DLinit('');
    DLmsg.setMsg('Get information please wait');
    DLmsg.open();
    ManuallySendCmd(sCmd);
    // ManuallySendCmd('{"Read":"All"}');

}
function DoReadAll(param) {
    JsonParser_Display(param)
    JsonParser_Driver(param)
    // JsonParser_Battery(eData)
    setCookie('ckIsReadDP', 'True')
    if (param === '{"Read":"Pass"}') {
        DLmsg.close()
        myTimer = setInterval(AutoSend, 2000)// read all 由這裡來啟動timer
    }
}
function DoInfo_Dispaly() {
    console.log('DoInfo_Dispaly');
    DoInfo();
}
function DoInfo_Driver() {
    console.log('DoInfo_Driver');
    DoInfo();
}
// $('#id_Console_FW').hide();
// $('#id_Display_FW').hide();
// $('#id_Driver_FW').hide();
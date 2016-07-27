//JQuery
//The hash (#) specifies to select elements by their ID's 
//The dot (.) specifies to select elements by their classname
window.addEventListener("load", init, false);//載入時會呼叫init的function
// Globa變數都放在這
var DLmsg = new DialogMsg();;
var DLbtn = new DialogBtnOk();
var DLbtnChk = new DialogBtnConfirm();
var reloadCount = 0;
var inputtext = '';
var myTimer;
var TLCount = 0;
function init1() {


  // DLmsg.DLinit('init');
  // DLmsg.open();

  // // setTimeout(function () { DLmsg.setMsg('2222');; }, 2000);
  // setTimeout(function () { DLmsg.close(); }, 1000);

}

function init() {

  DLmsg.DLinit('init');
  DLmsg.open();

  // setTimeout(function () { DLmsg.setMsg('haha'); }, 2000);
  setInterval(ErrorCount, 1000)
  //step1 :先做browser檢查
  WebSocketCheck(WSCheckPass, WSCheckFail)
}
function ErrorCount() {
  reloadCount++;
  console.log('ErrorCount : ' + reloadCount)
  if (reloadCount > 10) {
    console.log('error')
  }

  if (reloadCount > 5) {
    // DLmsg.setMsg('斷線中');
    // DLmsg.open();
  }
  if (reloadCount > 20) {
    location.reload();
    reloadCount = 0
  }
}
function WSCheckPass() {
  //step2 :開啟WS
  doConnect();

  // //0.5秒後起動,2秒送一次資料
  // setTimeout(function () {
  //   myTimer = setInterval(AutoSend, 2000)
  // }, 500);
}

function WSCheckFail() {

  DLmsg.setMsg('Your browser does not support ws');

}

function CheckVersion(param, callback_pass, callback_fail) {

  if (param === true) {
    (callback_pass && typeof (callback_pass) === "function") && callback_pass();
  } else {
    (callback_fail && typeof (callback_fail) === "function") && callback_fail();
  }
}
function CV_pass() {
  //step4 :檢查檢查client狀態狀態
  inputtext = '{"CheckComStatus":""}';
  doSend(inputtext);
}
function CV_fail() {
  DLmsg.setMsg('Your Version too old ! please download last version <A HREF="#">Click to Downoad</A>');

}

function CheckComStatus(param, callback_pass, callback_fail) {


  if (param === true) {
    (callback_pass && typeof (callback_pass) === "function") && callback_pass();
  } else {
    (callback_fail && typeof (callback_fail) === "function") && callback_fail();
  }
}
function CCS_pass() {
  DLmsg.close();
  //step5 :持續連線
  myTimer = setInterval(AutoSend, 2000)


}
function CCS_fail() {

  DLmsg.setMsg('Your dongle not connect ! please check connected !');

  //回到step4
  CV_pass();

}

function AutoSend() {
  clearInterval(myTimer);
  // DLmsg.close()
  // $("#test2").attr("disabled", false);
  inputtext = '{"KeepConn":"None"}';
  doSend(inputtext);
}

function ManuallySend() {
  clearInterval(myTimer);
  inputtext = '{"Read":"None"}';
  doSend(inputtext);
}
function ManuallySendCmd(params) {
  clearInterval(myTimer);
  inputtext = params;
  doSend(inputtext);
}
function ManuallySendProgressBar(params) {
  clearInterval(myTimer);
  inputtext = params;
  doSend(inputtext);
}
function doConnect() {
  try {
    var n = new Date().toLocaleString();
    console.log(n)
    DLmsg.setMsg('Please Waiting... <a target="_blank" href="static/file/main_cmd.exe">download</a> <a target="_blank" href="#">FAQ</a>');
    url = "ws://127.0.0.1:58000/";
    websocket = new WebSocket(url);
    websocket.onopen = function (evt) { WSOpen(evt) };
    websocket.onclose = function (evt) { WSClose(evt) };
    websocket.onmessage = function (evt) { WSMessage(evt) };
    websocket.onerror = function (evt) { WSError(evt) };
  } catch (error) {
    console.log(error);
    var n = new Date().toLocaleString();
    console.log(n)
    setTimeout(doConnect, 1000);//斷線重連
  }

}

function WSOpen(evt) {

  console.log('connected')
  var a = new Date().toLocaleString();
  console.log(a)
  DLmsg.setMsg('Check Client 版本!');
  //step3 :檢查版本
  inputtext = '{"CheckVersion":""}';
  doSend(inputtext);

}

function WSClose(evt) {
  console.log('disconnected')
  doConnect();
}

function doCheckVer(param) {
  var cvstatus = false;
  var jsonObj = JSON.parse(param);
  console.log(jsonObj.CheckVersion)
  if (jsonObj.CheckVersion === 0.1) {
    cvstatus = true;
  }
  CheckVersion(cvstatus, CV_pass, CV_fail);
}
function doCheckStatus(param) {
  var CCStatus = false;
  var jsonObj = JSON.parse(param);
  console.log(jsonObj.CheckComStatus)
  if (jsonObj.CheckComStatus === 'Pass') {
    CCStatus = true;
  }
  CheckComStatus(CCStatus, CCS_pass, CCS_fail);
}
function WSMessage(evt) {
  reloadCount = 0;

  clearInterval(myTimer);
  // myTimer.pause();
  console.log(evt.data);
  var eData = evt.data;
  //Part A 不需要啟動AutoSend,做完要用return
  if (inputtext.indexOf('CheckVersion') > 0) {
    doCheckVer(eData);
    return;
  }

  if (inputtext.indexOf('CheckComStatus') > 0) {
    doCheckStatus(eData);
    return;
  }

  if (inputtext.indexOf('UpgradeFW') > 0) {
    UpgradeFWCheck(eData)
    return;
  }

  if (inputtext === '{"VehicleTest":"Light"}') {
    doTestLight(eData);
    return;
  }

  if (inputtext === '{"VehicleTest":"CadenceSensor"}') {
    CadenceSensorCheck(eData)
    return;
  }
  if (inputtext === '{"VehicleTest":"Display_Part3"}') {
    Display_Part3Check(eData)
    return;
  }

  if (inputtext === '{"Read":"All"}' || inputtext === '{"OnlyRead":"All"}') {
    DoReadAll(eData)
    return;
  }
  //Part B 啟動AutoSend
  myTimer = setInterval(AutoSend, 2000)

  if (inputtext === '{"OnlyRead":"Display"}') {
    DLmsg.close()
    JsonParser_Display(eData)
  }
  if (inputtext === '{"Read":"Display"}') {
    DLmsg.close()
    JsonParser_Display(eData)
    setCookie('ckIsReadDP', 'True')
  }

  if (eData === '{"WriteCustomize":"Finish"}') {
    DLmsg.close();
  }
  if (inputtext === '{"TestHistory":"None"}') {
    DLmsg.close()
    JsonParser_TestHistory(eData)
  }
  if (inputtext === '{"VehicleTest":"BT"}') {
    TestBTEnd(eData);
  }
  if (inputtext === '{"VehicleTest":"Driver"}') {
    TestDriverEnd(eData);
  }
  if (inputtext === '{"VehicleTest":"Motor"}') {
    TestMotorEnd(eData);
  }
  if (inputtext === '{"VehicleTest":"Battery"}') {
    TestBatteryEnd(eData);
  }
  if (inputtext === '{"VehicleTest":"SpeedSensor"}') {
    TestSpeedSensorEnd(eData);
  }

  if (inputtext === '{"GetFWVer":""}') {
    DoCheckFWPart1(eData);
  }
  if (inputtext === '{"KeepConn":"None"}') {
    DoCheckKeepConn(eData);
  }
  // if (inputtext === '{"VehicleTest":"Display_Part2"}') {
  //   TestDisplay2End(eData);
  // }
}


function DoCheckKeepConn(param) {
  var jsonObj = JSON.parse(param);
  if (jsonObj.KeepConn === 'Fail') {
    if (DLmsg.isOpen() === false) {
      DLmsg.DLinit('Connect NG!');
      DLmsg.open();
    }

  } else {
    DLmsg.close();
  }
}




function WSError(evt) {
  websocket.close();
  console.log(evt);
}

function doSend(message) {
  console.log("sent: " + message + '\n');
  try {
    websocket.send(message);
  } catch (error) {
    console.log('doSend Error : ' + error)
  }
}

function doDisconnect() {
		websocket.close();
}

function WebSocketCheck(callback_pass, callback_fail) {
  DLmsg.setMsg('Check browser support ws');
  if ("WebSocket" in window) {
    (callback_pass && typeof (callback_pass) === "function") && callback_pass();
  }
  else {
    (callback_fail && typeof (callback_fail) === "function") && callback_fail();
  }
}

function allclose() {
  var inputs = document.getElementsByTagName("INPUT");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
}
function allopen() {
  var inputs = document.getElementsByTagName("INPUT");
  for (var i = 0; i < inputs.length; i++) {

    inputs[i].disabled = false;

  }
}

function JsonParser_TestHistory(params) {
  var jsonObj = JSON.parse(params);
  //  console.log(jsonObj)
  Mapping(jsonObj);
}
function JsonParser_Driver(params) {
  var jsonObj = JSON.parse(params);
  if (jsonObj[0] === 'Driver') {
    Mapping_Driver(jsonObj[1]);
  }
}
function JsonParser_Display(params) {
  var jsonObj = JSON.parse(params);
  // console.log(jsonObj);
  console.log(jsonObj[0]);
  // console.log(jsonObj[1].ERR_REC_MISC);
  // console.log(jsonObj[1].PNL_MAN_DIST);
  // console.log(jsonObj[1].PRD_LMOD_DATE);
  // console.log(timeConverter(jsonObj[1].PRD_LMOD_DATE));
  if (jsonObj[0] === 'Display') {
    Mapping(jsonObj[1]);

  }


}
function Mapping_Driver(params) {
  var sKey, sValue;
  for (sKey in params) {
    sValue = params[sKey];
    try {
      // console.log(sKey + ' : ' + sValue)
      var id = '[id=Driver_' + sKey + ']';//所有ID都會被更新
      $(id).html(sValue);
    } catch (error) {
      console.log(sKey + ' ' + error);
    }
  }
}
function Mapping(params) {
  var sKey, sValue;
  for (sKey in params) {
    sValue = params[sKey];
    // console.log("name : " + sKey + " : value : " + sValue) ;
    try {
      // document.getElementById(sKey).innerHTML=sValue;
      // var id='#'+sKey;//只有第一個抓到的ID
      var id = '[id=' + sKey + ']';//所有ID都會被更新
      if (sKey === 'PRD_LMOD_DATE') {
        sValue = timeConverter(sValue)
      }
      if (sKey === 'PNL_MAN_DIST') {
        sValue = sValue / 100000;
      }
      if (sKey === 'PNL_ASLP_TIME') {
        sValue = sValue / 60;
      }
      $(id).html(sValue);
      $(id).val(sValue);//set input value
      var sname = 'input[name=' + sKey + ']';
      $(sname).val(sValue);
      //a href
      //$(id).attr('href','../../'+ sValue)
      if (inputtext === '{"TestHistory":"None"}') {
        $(id).attr('onclick', "PDFFile('" + sValue + "')");
      }

    } catch (error) {
      console.log(sKey + ' ' + error);
    }
  }
}

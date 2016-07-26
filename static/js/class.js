function DialogMsg() {
    var dialog;
    var _isOpen = false;
    this.DLinit = function (param) {
        dialog = new BootstrapDialog({
            type: BootstrapDialog.TYPE_SUCCESS,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            title: 'Message',
            message: param
        }
        );
    };

    this.open = function () {

        dialog.open();
        _isOpen = true;

    }
    this.close = function () {
        //     // setTimeout(function () { dialog.close(); }, 500);
        dialog.close();
        _isOpen = false;
    }
    this.setMsg = function (param) {
        dialog.setMessage(param);
    }
    this.isOpen = function () {

        return _isOpen;
    }

}
function DialogBtnOk() {
    var dialog;
    this.DLinit = function (param) {
        dialog = new BootstrapDialog({
            type: BootstrapDialog.TYPE_SUCCESS,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            title: 'Message',
            message: param,
            buttons: [{
                id: 'btnOk',
                label: 'OK'
            }]
        }
        );
    };

    this.open = function () {
        dialog.open();
    }
    this.close = function () {
        // setTimeout(function () { dialog.close(); }, 500);
        dialog.close();
    }
    this.setMsg = function (param) {
        dialog.setMessage(param);
    }

    this.btnDisable = function (param) {
        var btn = dialog.getButton('btnOk');
        btn.disable();
        // btn.spin();
    }
    this.btbEnable = function (param) {
        var btn = dialog.getButton('btnOk');
        btn.enable();
        // btn.stopSpin();
    }
    this.btnLabel = function (param) {
        setTimeout(function () {
            $('#btnOk').html(param);
        }, 300)
    }
    this.btnAction = function (callback_fun) {
        var btn = dialog.getButton('btnOk');
        btn.unbind();//把事件清除
        btn.click(function () {
            (callback_fun && typeof (callback_fun) === "function") && callback_fun();
        });
    }
    this.btnOnShow = function (callback_fun) {
        dialog.onShown(callback_fun)

    }
    this.btnOnHide = function (callback_fun) {
        dialog.onHide(callback_fun)
    }
}
function DialogBtnConfirm() {
    var dialog;
    this.DLinit = function (param) {
        dialog = new BootstrapDialog({
            type: BootstrapDialog.TYPE_SUCCESS,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            title: 'Message',
            message: param,
            buttons: [
                {
                    id: 'btnOk',
                    label: 'Pass'
                }, {
                    id: 'btnCancel',
                    label: 'Fail'
                }
            ]
        }
        );
    };

    this.open = function () {
        dialog.open();
    }
    this.close = function () {
        // setTimeout(function () { dialog.close(); }, 500);
        dialog.close();
    }
    this.setMsg = function (param) {
        dialog.setMessage(param);
    }

    this.btnDisable = function (param) {
        var btnOK = dialog.getButton('btnOk');
        btnOK.disable();
        var btnNG = dialog.getButton('btnCancel');
        btnNG.disable();
    }
    this.btbEnable = function (param) {
        var btnOK = dialog.getButton('btnOk');
        btnOK.enable();
        var btnNG = dialog.getButton('btnCancel');
        btnNG.enable();
    }
    this.btnLabel = function (param) {
        setTimeout(function () {
            $('#btnOk').html(param);
        }, 300)
    }
    this.btnOKAction = function (callback_fun) {
        var btn = dialog.getButton('btnOk');
        btn.unbind();//把事件清除
        btn.click(function () {
            (callback_fun && typeof (callback_fun) === "function") && callback_fun();
        });
    }
    this.btnNGAction = function (callback_fun) {
        var btn = dialog.getButton('btnCancel');
        btn.unbind();//把事件清除
        btn.click(function () {
            (callback_fun && typeof (callback_fun) === "function") && callback_fun();
        });
    }
}

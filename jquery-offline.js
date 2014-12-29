/**
 * Created by Nobita on 14/12/27.
 * version: 1.0.0
 */
(function ($, window, localStorage) {
    'use strict';
    function Offline() {
        this.defalutOptions = {
            offConfig: {
                method: 'ajax',
                accessStatus: [500, 404], // 如果 httpStatus 是 500 或 404 就會進行本機端暫存
                message: 'Network not connect, data has saved in localStorage.',
                key: ''
            },
            checkTime: 5000
        };

        this.cacheList = JSON.parse(localStorage.jqOffline || '[]');
        this.timeoutId = null;
        this.networkIsConnect = true;
        this.processLocalXHR();
    }

    // 啟動檢查網路機制
    Offline.prototype.startCheck = function () {
        var _this = this;
        _this.timeoutId = setTimeout(function () {
            _this.processLocalXHR();
            _this.startCheck();
        }, this.defalutOptions.checkTime);
    };

    Offline.prototype.stopCheck = function () {
        window.clearTimeout(this.timeoutId);
    };

    // 迴圈執行所有暫存 XHR
    Offline.prototype.processLocalXHR = function () {
        var _this = this;

        if (_this.cacheList.length) {
            $.each(_this.cacheList, function (index, keyName) {
                var opts = JSON.parse(localStorage[keyName]);

                // don't need to do callback
                _this.main(opts.offConfig.method, opts);
            });
        }
    };

    Offline.prototype.checkIsAccessStatus = function (status, options) {
        return -1 !== $.inArray(status, options.offConfig.accessStatus);
    };

    // 將資料存在本機端
    Offline.prototype.saveDataInLocal = function (options) {
        var _this = this;
        options.offConfig.key = (options.offConfig.key) ? options.offConfig.key : 'offline_' + (new Date()).getTime() + Math.floor(Math.random() * 10000);
        localStorage[options.offConfig.key] = JSON.stringify(options);
        if (-1 === $.inArray(options.offConfig.key, _this.cacheList)) {
            _this.cacheList.push(options.offConfig.key);
        }
        localStorage.jqOffline = JSON.stringify(this.cacheList);

        // 如果沒有 timeoutId 就啟動自動檢查機制
        if (!_this.timeoutId) {
            _this.startCheck();
        }
    };

    // offline 版 ajax
    Offline.prototype.ajax = function (opts) {
        var _this = this,
            d = $.Deferred();

        $.ajax(opts.url, opts).done(function (response, status) {
            if (_this.checkIsAccessStatus(status, opts)) {
                _this.saveDataInLocal(opts);
                d.resolve(opts.response, status);
            } else {
                d.resolve.apply(this, arguments);
            }
        }).fail(function (response) {
            if (_this.checkIsAccessStatus(response.status, opts)) {
                _this.saveDataInLocal(opts);
                d.resolve(opts.response, response.status);
            } else {
                d.reject.apply(this, arguments);
            }
        });

        return d.promise();
    };

    Offline.prototype.main = function (method) {
        var _this = this;
        
        switch (method) {
            case 'stopCheck':
                _this.stopCheck();
                break;
            case 'setCheckTime':
                var num = parseInt(arguments[1]);

                if (num && (0 < num)) {
                    _this.defalutOptions.checkTime = num;
                }
                return this;

            case 'ajax':
                var opts = arguments[1] || {};
                $.extend(opts, _this.defalutOptions);
                opts.offConfig.method = method;

                if (opts.url) {
                    return _this.ajax(opts);
                } else {
                    throw 'url is not define.';
                }
                return this;
            default:
                return this;
        }
    };

    var offline = new Offline();

    $.offline = function () {
        return offline.main.apply(offline, arguments);
    };
})(jQuery, window, window.localStorage);

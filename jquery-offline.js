/**
 * Created by Nobita on 14/12/27.
 * version: 1.0.0
 */
(function ($) {
    function Offline() {
        this.defOption = {
            response: {
                accessStatus: [500, 404],
                message: 'Network not connect, data has saved in localStorage.',
                key: ''
            }
        }
    }

    Offline.prototype.checkIsAccessStatus = function (status, opts) {
        return -1 !== $.inArray(status, opts.response.accessStatus);
    };

    Offline.prototype.ajax = function (options) {
        var _this = this,
            d = $.Deferred(),
            opts = $.extend({}, this.defOption, options);

        $.ajax(opts.url, opts).done(function (response, status) {
            if (_this.checkIsAccessStatus(status, opts)) {
                d.resolve(opts.response);
            } else {
                d.resolve.apply(this, arguments);
            }
        }).fail(function (response, status) {
            if (_this.checkIsAccessStatus(status, opts)) {
                d.resolve(opts.response);
            } else {
                d.zIndex.apply(this, arguments);
            }
        });

        return d.promise();
    };



    $.offline = function (method, options) {
        var offline = new Offline();

        switch (method) {
            case 'ajax':
                return offline.ajax(options);
            default:
                return this;
        }
    };
})(jQuery);
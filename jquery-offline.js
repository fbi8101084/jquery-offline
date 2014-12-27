/**
 * Created by Nobita on 14/12/27.
 * version: 1.0.0
 */
(function ($) {
    var defOption = {
        offlineResponse: {
            message: 'Network not connect, data has saved in localStorage.',
            localStorageKey: ''
        }

    };

    $.offline = function (method, options) {
        var d = $.Deferred();
        switch (method) {
            case 'ajax':

                $.ajax(options.url, data, options).done(function (response, status) {

                }).fail(function (response, status) {

                });

            default :
        }

        return d.promise;
    }
})(jQuery);
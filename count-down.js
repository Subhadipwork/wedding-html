$(document).ready(function() {
    $('[data-countdown]').each(function () {
        var deadline = moment($(this).data('countdown')).valueOf();
        var datadays = $(this).children('[data-days]');
        var datahours = $(this).children('[data-hours]');
        var dataminutes = $(this).children('[data-minutes]');
        var dataseconds = $(this).children('[data-seconds]');

        var x = setInterval(function () {
            var now = new Date().getTime();
            var t = deadline - now;

            var days = Math.floor(t/(1000*60*60*24));
            var hours = Math.floor(t%(1000*60*60*24) / (1000*60*60));
            var minutes = Math.floor(t%(1000*60*60) / (1000*60));
            var seconds = Math.floor(t%(1000*60) / (1000));

            datadays.html(days < 10 ? '0'+days:days).append('<span class="label">Days</span>');
            datahours.html(hours < 10 ? '0'+hours:hours).append('<span class="label">Hours</span>');
            dataminutes.html(minutes < 10 ? '0'+minutes:minutes).append('<span class="label">Minutes</span>');
            dataseconds.html(seconds < 10 ? '0'+seconds:seconds).append('<span class="label">Seconds</span>');

            if(t <= 0){
                clearInterval(x);
                datadays.html('0').append('<span class="label">Days</span>');
                datahours.html('0').append('<span class="label">Hours</span>');
                dataminutes.html('0').append('<span class="label">Minutes</span>');
                dataseconds.html('0').append('<span class="label">Seconds</span>');
            }
        },1000);
    });
});
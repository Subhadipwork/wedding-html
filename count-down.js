$(document).ready(function () {
    var countdownReached = false;

    $('[data-countdown]').each(function () {
        var countdownElem = $(this);
        var deadline = moment(countdownElem.data('countdown')).valueOf();

        var datadays = countdownElem.children('[data-days]');
        var datahours = countdownElem.children('[data-hours]');
        var dataminutes = countdownElem.children('[data-minutes]');
        var dataseconds = countdownElem.children('[data-seconds]');

        var x = setInterval(function () {
            var now = new Date().getTime();
            var t = deadline - now;

            if (t <= 0 && !countdownReached) {
                countdownReached = true;
                clearInterval(x);

                // Set all to 00
                datadays.html('00<span class="label">Days</span>');
                datahours.html('00<span class="label">Hours</span>');
                dataminutes.html('00<span class="label">Minutes</span>');
                dataseconds.html('00<span class="label">Seconds</span>');

                // Hide countdown & show custom content
                countdownElem.fadeOut(1000, function () {
                    countdownElem.after(`
                        <div class="countdown-complete banner">
                            <h3>🎉 It's Our Wedding Day! 🎉</h3>
                            <p>Thank you for being a part of our celebration.</p>
                        </div>
                    `);
                });
            }

            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((t % (1000 * 60)) / 1000);

            datadays.html((days < 10 ? '0' : '') + days + '<span class="label">Days</span>');
            datahours.html((hours < 10 ? '0' : '') + hours + '<span class="label">Hours</span>');
            dataminutes.html((minutes < 10 ? '0' : '') + minutes + '<span class="label">Minutes</span>');
            dataseconds.html((seconds < 10 ? '0' : '') + seconds + '<span class="label">Seconds</span>');
        }, 1000);
    });

    // Fireworks on invitation open if countdown complete
    $('#open_invitation').on('click', function () {
        if (countdownReached) {
            startFireworks();
        }
    });

    // Initialize Fireworks.js
 function startFireworks() {
    const container = document.getElementById('fireworks-container');

    if (!container || !window.Fireworks) {
        console.warn('❌ Fireworks container or library not found!');
        return;
    }

    // Manually preload sound files
    const soundFiles = [
        './sounds/explosion0.mp3',
        './sounds/explosion1.mp3',
        './sounds/explosion2.mp3',
    ];

    const sounds = soundFiles.map(src => {
        const audio = new Audio(src);
        audio.volume = 0.8; // set initial volume
        return audio;
    });

    const fireworks = new window.Fireworks.default(container, {
        hue: { min: 0, max: 360 },
        delay: { min: 10, max: 30 },
        speed: 3.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.7,
        particles: 150,
        trace: 5,
        explosion: 7,
        autoresize: true,
        brightness: { min: 70, max: 90 },
        decay: { min: 0.015, max: 0.03 },

        // Disable built-in sound
        sound: { enable: false },

        boundaries: {
            top: 0,
            bottom: container.clientHeight,
            left: 0,
            right: container.clientWidth
        }
    });

    // Start fireworks and play random sound every 700ms
    fireworks.start();

    const soundInterval = setInterval(() => {
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        sound.currentTime = 0;
        sound.play().catch(err => console.warn('🔇 Sound playback blocked:', err));
    }, 700); // Adjust as needed for realism

    setTimeout(() => {
        fireworks.stop();
        clearInterval(soundInterval);
    }, 10000); // 10s
}



});

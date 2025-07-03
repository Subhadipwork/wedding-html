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
                            <a href="https://www.google.com" class="btn-gallery">View Photos</a>
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

    const fireworks = new window.Fireworks.default(container, {
        hue: { min: 0, max: 360 },
        delay: { min: 10, max: 30 }, // faster fire
        speed: 3.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.7, // more curve
        particles: 150, // more particles
        trace: 5,       // longer trail
        explosion: 7,   // bigger explosion size
        autoresize: true,
        brightness: { min: 70, max: 90 },
        decay: { min: 0.015, max: 0.03 },
        sound: {
            enable: true,
            files: [
                './sounds/explosion0.mp3',
                './sounds/explosion1.mp3',
                './sounds/explosion2.mp3',
            ],
            volume: { min: 2, max: 4 },
            // Add sound effects for fireworks
            onStart: function () {
                // Play random firework sound
                const sound = sounds[Math.floor(Math.random() * sounds.length)];
                sound.currentTime = 0; // Reset to start
                sound.play().catch(err => console.error('Sound play error:', err));
            }

        },
        boundaries: {
            top: 0,
            bottom: container.clientHeight,
            left: 0,
            right: container.clientWidth
        }
    });

    fireworks.start();

    // Stop after 10 seconds
    setTimeout(() => {
        fireworks.stop();
    }, 10000);
    }


});

// Import Firebase modules (assumes they are included in your project)
// import firebase from 'firebase/app';
// import 'firebase/database';

// Firebase configuration (replace with your actual credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN.firebaseapp.com",
    databaseURL: "YOUR_DB_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function ambilNamaDariURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nama = urlParams.get("untuk");
    return nama;
}

function gantiTeks() {
    const nama = ambilNamaDariURL();
    if (nama) {
        document.getElementById("nama").textContent = nama;
    }
}

window.addEventListener("load", gantiTeks);

lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'disableScrolling': true
});
document.addEventListener('DOMContentLoaded', function () {
    var http = new XMLHttpRequest();
    http.open("GET", "https://mycloud.devazy.iotflows.com/onload?reload=sukses", true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // alert(this.responseText);
            var data = JSON.parse(this.responseText);
            var len = data.length;
            for (var i = 0; i < len; i++) {
                $("#message_list").prepend('<li>\n' +
                    '                        <span class="from">' + data[i].nama + '</span>\n' +
                    '                        <span class="guest_message">' + data[i].pesan + '</span>\n' +
                    '                    </li>');
            }
        }
    }
    var splide = new Splide('.splide',
        {
            type: 'loop',
            perPage: 3,
            pagination: true,
            arrows: true,
            lazyLoad: 'nearby',
            perMove: 1,
            breakpoints: {
                640: {
                    perPage: 2,
                },
                480: {
                    arrows: false,
                    perPage: 1,
                    focus: 'center',
                }
            }
        });
    splide.mount();
});

$(document).ready(function () {
    $("#btn_message").on("click", function (e) {
        e.preventDefault();
        if ($("#guest_name").val() === '') {
            return alert('Name cannot be empty')
        }
        if ($("#message").val() === '') {
            return alert('Message cannot be empty');
        }
        if ($("#guest_name").val() !== '' && $("#message").val() !== '') {
            $(this).html('Sending Message...');
            var btn = $(this);
            btn.attr("disabled", "disabled");
            setTimeout(function () {
                $('#form_message').submit();
            }, 1500);
        }
    });

    $('#form_message').on('submit', function (event) {
        event.preventDefault();
        var btn = $("#btn_message");
        var guestName = $('#guest_name').val();
        var message = $('#message').val();
        var attendance = $('input[name="attendant"]:checked').val();

        // Show loading state
        Swal.fire({
            title: 'Sending...',
            text: 'Please wait while we process your message',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        // Save to Firebase
        db.ref('messages').push({
            name: guestName,
            message: message,
            attendance: attendance,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            // Send email notification
            $.ajax({
                url: 'https://mycloud.devazy.iotflows.com/send-email',
                method: 'POST',
                data: {
                    to: 'your@email.com',
                    subject: 'New Wedding RSVP from ' + guestName,
                    body: `
                        Name: ${guestName}
                        Message: ${message}
                        Attendance: ${attendance}
                    `
                },
                success: function() {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thank You!',
                        text: 'Your message has been sent successfully',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        }
                    });

                    // Update UI
                    $("#message_list").prepend(`
                        <li class="animate__animated animate__fadeIn">
                            <span class="from">${guestName}</span>
                            <span class="guest_message">${message}</span>
                        </li>
                    `);
                    
                    // Clear form
                    $('#guest_name').val('');
                    $('#message').val('');
                    btn.html('Send');
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! Please try again.',
                        customClass: {
                            confirmButton: 'btn btn-danger'
                        }
                    });
                    btn.html('Send');
                    btn.removeAttr("disabled");
                }
            });
        });
    });

    // Remove any gift-related event listeners
    // Delete this if it exists:
    // $("#btn_send_gift").on("click", function() { ... });

    loadMessages();
});

// Replace existing alert function with modern SweetAlert
function alert(msg, type = 'info') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: type,
        title: msg
    });
}

// Add Firebase data listener
function loadMessages() {
    db.ref('messages')
        .orderByChild('timestamp')
        .limitToLast(50)
        .on('value', (snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.unshift(childSnapshot.val());
            });
            
            $("#message_list").empty();
            messages.forEach(msg => {
                $("#message_list").append(`
                    <li class="animate__animated animate__fadeIn">
                        <span class="from">${msg.name}</span>
                        <span class="guest_message">${msg.message}</span>
                    </li>
                `);
            });
        });
}

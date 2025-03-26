var sections  = null;

if (document.getElementById("open_invitation")){
    document.getElementById("open_invitation").addEventListener("click", open_invitation);
}

function open_invitation() {
    // $("#prokes_modal").fadeIn();
    confirm_open_invitation();
}

function confirm_open_invitation(){
    // $("#prokes_modal").fadeOut();
    var container = document.querySelector(".container");
    var cover = document.querySelector("#cover");
    var index = document.querySelector("#index");
    let btn_gift = document.querySelector('.btn-send-gift');

    index.classList.add(
        "animate__animated",
        "animate__fadeOut",
        "animate__slow"
    );

    container.classList.add(
        "animate__animated",
        "animate__fadeIn",
        "animate__slow"
    );

    setTimeout(function () {
        index.remove();
        container.classList.remove("hide");
        if($("#song_url").val()!==''){
            $('#play_button').removeClass('hide');
        }
        AOS.init();

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if(btn_gift){
                        btn_gift.classList.add("hide");
                    }
                    $('.navItem').removeClass('active');
                    if(entry.target.id === 'cover'){
                        $('.navItem').removeClass('active');
                    }else if(entry.target.id === 'bridegroom'){
                        $('.bridegroomNavItem').addClass('active');
                    }else if(entry.target.id === 'event'){
                        $('.eventNavItem').addClass('active');
                    }else if(entry.target.id === 'story'){
                        $('.storyNavItem').addClass('active');
                    }else if(entry.target.id === 'galery'){
                        $('.galeryNavItem').addClass('active');
                    }
                    else if(entry.target.id === 'rsvp'){
                        $('.rsvpNavItem').addClass('active');
                        if(btn_gift){
                            btn_gift.classList.remove("hide");
                            btn_gift.classList.add(
                                "animate__animated",
                                "animate__backInUp",
                                "animate__fast"
                            );
                        }
                    }

                    if(entry.target.id === 'footer'){
                        $('.nav').addClass('hide');
                    }else{
                        $('.nav').removeClass('hide');
                    }
                }
            });
        }, {rootMargin: "0px", threshold:0.3});
        document.querySelectorAll('section').forEach(section => { observer.observe(section) });
    }, 1000);

    if($("#song_url").val()!=='') {
        audio.play();
    }
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'disableScrolling' :true
    });
}
$(document).on('click',"#btn_close_top_notif", function () {
   $(".demo-top-notif").fadeOut();
});

$(document).on("click", "#btn_send_gift", function () {
    $("#send_gift_modal").fadeIn();
    $("body").css('overflow','hidden');
});

$(document).on("click", ".close-modal", function () {
    $(".modal").fadeOut(function () {
        $("body").css("overflow", "auto");
    });
});

$(document).on("click", ".copy", function () {
    var value = $(this).attr('data-number');
    navigator.clipboard.writeText(value);
    var t = $(this);
    t.html('Copied');
    setTimeout( function () {
        t.html('Copy');
    },1500);
});

$(document).on("click", ".copy-to-clipboard", function () {
    var value = $(this).attr('data-copy');
    navigator.clipboard.writeText(value);
    // var t = $(this);
    // t.html('Copied');
    // setTimeout( function () {
    //     t.html('Copy');
    // },1500);
    Toastify({
        text: "No rekening di copy ",
        duration: 3000,
        style: {
            background: "#515151"
        }
    }).showToast();
});

var audio = new Audio($("#song_url").val());
audio.volume=0.5;
audio.onended = function () {
    var audio_control = document.querySelector("#audio_control");
    audio_control.classList.toggle("play");

    document.querySelector("#play_button").setAttribute("data-status", "pause");
};

function play_pause(e) {
    var audio_control = document.querySelector("#audio_control");
    audio_control.classList.toggle("play");

    status = e.getAttribute("data-status");

    if (status === "play") {
        status = "pause";
        audio.pause();
    } else {
        status = "play";
        audio.play();
    }
    e.setAttribute("data-status", status);
}

$(document).on('click','.btn-gift-confirmation', function (e) {
    e.preventDefault();
    $("#list_account_gift").fadeOut();
    $(".footer-send-gift").fadeOut();
    $("#confirmation_form_gift").fadeIn(function () {
        $(this).removeClass('hide');
    });
});
$(document).on('click','#btn_cancel_confirm', function (e) {
    e.preventDefault();
    $("#list_account_gift").fadeIn(function () {
        $("#confirmation_form_gift").addClass('hide');
        $(".footer-send-gift").fadeIn();
    });
});
$('input:radio[name="gift_type"]').on('change', function(e) {
    if($(this).val() === 'digital'){
        $("#product_form").addClass('hide')
        $("#digital_form").removeClass('hide')
    }

    if($(this).val() === 'product'){
        $("#digital_form").addClass('hide')
        $("#product_form").removeClass('hide')
    }
});
// Supabase setup
const SUPABASE_URL = 'https://stgjywwxprtgogaazehv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2p5d3d4cHJ0Z29nYWF6ZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NjY5NDcsImV4cCI6MjA2NDM0Mjk0N30.UALd45WQQ7cZdF9jLUBBWK_-IM0CknpKAiA359kdYHo';

// Create Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
   
    loadMessages();
    loadGalleryImages();
    // var splide = new Splide('.splide',
    //     {
    //         type: 'loop',
    //         perPage: 3,
    //         pagination: true,
    //         arrows: true,
    //         lazyLoad: 'nearby',
    //         perMove: 1,
    //         breakpoints: {
    //             640: {
    //                 perPage: 2,
    //             },
    //             480: {
    //                 arrows: false,
    //                 perPage: 1,
    //                 focus: 'center',
    //             }
    //         }
    //     });
    // splide.mount();
    
    // Load messages from Supabase when DOM is loaded
    
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

        // Save to Supabase
        supabaseClient
            .from('messages')
            .insert([
                { 
                    name: guestName, 
                    message: message, 
                    attendance: attendance,
                    created_at: new Date().toISOString()
                }
            ])
            .then(response => {
                if (response.error) {
                    throw response.error;
                }
                
                // Success notification
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

                // Update UI with the new message
                $("#message_list").prepend(`
                    <li class="animate__animated animate__fadeIn">
                        <span class="from">${guestName}</span>
                        <span class="guest_message">${message}</span>
                    </li>
                `);
                
                // Clear form
                $('#guest_name').val('');
                $('#message').val('');
                btn.html('Send <img src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/icon/send-blue.png" alt="">');
                btn.removeAttr("disabled");
                
                // Reload the latest messages from Supabase
                loadMessages();
            })
            .catch(error => {
                console.error('Error inserting message:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again.',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    }
                });
                btn.html('Send <img src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/icon/send-blue.png" alt="">');
                btn.removeAttr("disabled");
            });
    }); // Added missing closing bracket for form submit handler
}); // Document ready function close

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

// Updated Supabase data fetching to limit to 10 messages
async function loadMessages() {
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (error) throw error;
            
        $("#message_list").empty();
        
        console.log('Fetched messages:', data);
        
        // If no messages yet, add a default message
        if (data.length === 0) {
            $("#message_list").append(`
                <li class="animate__animated animate__fadeIn">
                    <span class="from">Elizabeth Bennet & Darcy</span>
                    <span class="guest_message">Marriage is a new chapter in life, filled with happiness,
                        togetherness, and all the beautiful things that come with it.</span>
                </li>
            `);
        } else {
            // Add the fetched messages with animation
            data.forEach(msg => {
                $("#message_list").append(`
                    <li class="animate__animated animate__fadeIn">
                        <span class="from">${msg.name}</span>
                        <span class="guest_message">${msg.message}</span>
                    </li>
                `);
            });
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        alert('Failed to load messages. Please refresh the page.', 'error');
    }
}

// Add this function to fetch gallery images from Supabase
async function loadGalleryImages() {
  try {
    // First get a list of files from the gallery directory in storage
    const { data: files, error } = await supabaseClient
      .storage
       .from('weddingimage')
        .list('gellery', {
            limit: 12,
            sortBy: { column: 'name', order: 'desc' }
        });
    if (error) throw error;
    
    // console.log('Gallery images loaded:', files);
    // Show loading indicator while fetching images

    
    if (files && files.length > 0) {
      // Empty the current gallery
      $(".image-list").empty();
      
      // Loop through the files and add them to the gallery
      files.forEach(file => {
        // Get a public URL for each image
        const imageUrl = supabaseClient
          .storage
          .from('weddingimage')
          .getPublicUrl(`gellery/${file.name}`).data.publicUrl;
          
        // Append the image to the gallery
        $(".image-list").append(`
          <div class="image" data-aos="fade-up" data-aos-duration="1000">
            <a href="${imageUrl}" data-lightbox="roadtrip">
              <img src="${imageUrl}" alt="Wedding Gallery Image">
            </a>
          </div>
        `);
      });
    } else {
      console.log('No gallery images found, using default images');
    }
  } catch (error) {
    console.error('Error loading gallery images:', error);
    
    // If there's an error, keep default gallery images
    $(".loading-gallery").hide();
  } finally {
    // Always hide the loading indicator when done
    setTimeout(() => {
      $(".loading-gallery").fadeOut();
    }, 500);
  }
}

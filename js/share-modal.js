// Share Modal JS

// Configuration
const shareModalConfig = {
    scrollThreshold: 1500,       // How far the user needs to scroll before showing modal (pixels)
    dontShowDays: 7,             // If user clicks "Don't show again", hide for this many days
    remindLaterHours: 24,        // If user clicks "Remind me later", hide for this many hours
    modalShowDelay: 500,         // Delay before showing modal after scroll threshold (milliseconds)
    storageKeyDontShow: 'wedding_share_modal_dont_show',
    storageKeyRemindLater: 'wedding_share_modal_remind_later'
};

// Share info
const shareInfo = {
    title: 'You\'re Invited to Subhadip & Sarbani\'s Wedding!',
    text: 'We\'re getting married! Join us for our special day.',
    url: window.location.href,
    hashtags: 'WeddingDay,SubhadipWedsSarbani'
};

// DOM elements
let modal, scrollShown = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    modal = document.getElementById('shareModal');
    setupModalEvents();
    checkScrollForModal();
});

// Set up all modal event listeners
function setupModalEvents() {
    // Close modal when clicking X
    const closeBtn = document.querySelector('.close-share-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });
    
    // "Don't show again" button
    const dontShowBtn = document.querySelector('.dont-show');
    if (dontShowBtn) {
        dontShowBtn.addEventListener('click', function() {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + shareModalConfig.dontShowDays);
            localStorage.setItem(shareModalConfig.storageKeyDontShow, expiryDate.getTime().toString());
            hideModal();
        });
    }
    
    // "Remind me later" button
    const remindLaterBtn = document.querySelector('.remind-later');
    if (remindLaterBtn) {
        remindLaterBtn.addEventListener('click', function() {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + shareModalConfig.remindLaterHours);
            localStorage.setItem(shareModalConfig.storageKeyRemindLater, expiryDate.getTime().toString());
            hideModal();
        });
    }
    
    // Copy link button
    const copyLinkBtn = document.getElementById('copyLink');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            copyToClipboard(shareInfo.url);
            
            const confirmationMsg = document.getElementById('copy-confirmation');
            confirmationMsg.style.display = 'block';
            
            setTimeout(function() {
                confirmationMsg.style.display = 'none';
            }, 3000);
        });
    }
}

// Check if we should show the modal based on scroll position
function checkScrollForModal() {
    // Don't show if user has opted out or delayed
    if (shouldSkipModalDisplay()) {
        return;
    }
    
    // Listen for scroll and show modal when threshold is reached
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show modal if:
        // 1. User scrolled beyond threshold
        // 2. Modal hasn't been shown yet in this session
        if (scrollTop > shareModalConfig.scrollThreshold && !scrollShown) {
            scrollShown = true;
            
            // Add a small delay for better UX
            setTimeout(function() {
                showModal();
            }, shareModalConfig.modalShowDelay);
        }
    });
}

// Show the share modal
function showModal() {
    if (modal) {
        modal.style.display = 'block';
        
        // Trigger reflow for animation
        void modal.offsetWidth;
        
        modal.classList.add('show');
        
        // Log event (could be replaced with analytics)
        console.log('Share modal shown');
        
        // Add analytics event if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share_modal_impression');
        }
    }
}

// Hide the share modal
function hideModal() {
    if (modal) {
        modal.classList.remove('show');
        
        // Wait for animation to finish before hiding completely
        setTimeout(function() {
            modal.style.display = 'none';
        }, 500);
    }
}

// Social media sharing functions
function shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareInfo.url)}`;
    openShareWindow(url, 'Facebook');
}

function shareOnWhatsApp() {
    const text = `${shareInfo.title} ${shareInfo.text} ${shareInfo.url}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    openShareWindow(url, 'WhatsApp');
}

function shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareInfo.text)}&url=${encodeURIComponent(shareInfo.url)}&hashtags=${shareInfo.hashtags}`;
    openShareWindow(url, 'Twitter');
}

// Helper to open share windows
function openShareWindow(url, platform) {
    window.open(url, `share-${platform}`, 'width=600,height=400');
    
    // Track sharing event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            method: platform,
            content_type: 'wedding_invitation',
            content_id: 'wedding_share'
        });
    }
}

// Copy URL to clipboard
function copyToClipboard(text) {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .catch(err => {
                console.error('Clipboard write failed:', err);
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback method for copying to clipboard
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-999999px';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

// Check if we should skip showing the modal
function shouldSkipModalDisplay() {
    // Check "Don't show again" preference
    const dontShowUntil = localStorage.getItem(shareModalConfig.storageKeyDontShow);
    if (dontShowUntil && parseInt(dontShowUntil) > Date.now()) {
        return true;
    }
    
    // Check "Remind me later" preference
    const remindLaterUntil = localStorage.getItem(shareModalConfig.storageKeyRemindLater);
    if (remindLaterUntil && parseInt(remindLaterUntil) > Date.now()) {
        return true;
    }
    
    return false;
}

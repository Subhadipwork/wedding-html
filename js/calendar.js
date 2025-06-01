/**
 * Calendar event saver utility
 * Detects device type and creates appropriate calendar event
 */

function saveToCalendar(event) {
  // Event details
  const title = "Subhadip & Sarbani's Wedding";
  const description = "Join us for our special day!";
  const location = "Soumodip Banquet Hall, Nahata, Gopalnagar, West Bengal";
  const startDate = new Date("2025-07-04T18:00:00+05:30"); // July 4, 2025, 6:00 PM IST
  const endDate = new Date("2025-07-04T21:00:00+05:30");   // July 4, 2025, 9:00 PM IST

  // Format dates for different calendar systems
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  
  // Detect device type
  const isApple = /iPad|iPhone|iPod|MacIntel/.test(navigator.platform) || 
                 (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  
  if (isApple) {
    // Apple Calendar (iOS/macOS)
    const appleUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${formattedStart}
DTEND:${formattedEnd}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT24H
DESCRIPTION:Reminder for ${title}
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    window.open(encodeURI(appleUrl));
  } else {
    // Google Calendar (Android/Others)
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedStart}/${formattedEnd}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    
    window.open(googleUrl);
  }
  
  event.preventDefault();
}

// Helper function to format date in the YYYYMMDDTHHMMSSZ format
function formatDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const calendarButtons = document.querySelectorAll('.btn-open-live');
  calendarButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      saveToCalendar(event);
    });
  });
});

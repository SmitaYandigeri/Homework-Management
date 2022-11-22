
  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('schedule');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      initialDate: '2022-12-12',
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,
      select: function(arg) {
        var title = prompt('Event Title:');
        if (title) {
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          })
        }
        calendar.unselect()
      },
      eventClick: function(arg) {
        if (confirm('Are you sure you want to delete this event?')) {
          arg.event.remove()
        }
      },
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: [
        {
          title: 'English homework',
          start: '2022-12-02'
        },
        {
          title: 'Long Event',
          start: '2022-11-07',
          end: '2020-09-10'
        },
        {
          title: 'Meeting',
          start: '2022-12-12T10:30:00',
          end: '2022-11-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2022-11-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2020-12-22T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2020-09-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2020-09-12T20:00:00'
        },
        {
          title: 'eng- chapter1 ',
          start: '2022-11-13T07:00:00'
        },
        {
            title: 'eng- chapter2',
            start: '2022-12-21T07:00:00'
          },
      ]
    });

    calendar.render();
  });
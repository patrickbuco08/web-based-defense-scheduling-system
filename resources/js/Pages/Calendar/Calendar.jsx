import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    // Component mounted
    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  const fetchEvents = async (info, successCallback, failureCallback) => {
    try {
      const res = await fetch('/api/defenses');
      const events = await res.json();
      successCallback(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      failureCallback(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={fetchEvents}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          height="auto"
        />
      </div>
    </div>
  );
}

export default Calendar;

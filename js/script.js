const intro = document.getElementById("intro-screen");
const main = document.getElementById("main-content");
const title = document.querySelector(".intro-title");

setTimeout(() => {

  title.classList.remove("opacity-0", "scale-90");
  title.classList.add("opacity-100", "scale-100");
  setTimeout(() => {
    intro.classList.add("opacity-0");

    setTimeout(() => {
      intro.style.display = "none";
      main.classList.remove("hidden");
    }, 1000);
  }, 1500);
}, 300);


const daysContainer = document.querySelector("#calendar-days");

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const modal = document.querySelector("#event-modal");

function renderCalendar() {
  daysContainer.innerHTML = "";

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const currectMonth = document.querySelector("#currectMonth");
  currectMonth.innerHTML = `${month[currentMonth]} ${currentYear}`;

  for (let i = 0; i < firstDay; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "p-4";
    daysContainer.appendChild(emptyBox);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");

    const month = (currentMonth + 1).toString().padStart(2, "0");
    const date = day.toString().padStart(2, "0");
    const dateKey = `${currentYear}-${month}-${date}`;

    const events = JSON.parse(localStorage.getItem(dateKey)) || [];

    dayBox.textContent = day;
    dayBox.className =
      "dayBox relative p-4 bg-white shadow-md rounded-xl text-center flex items-center justify-center text-gray-800 font-medium hover:bg-purple-200 cursor-pointer transition duration-300";

      if(currentYear === today.getFullYear() &&
        currentMonth === today.getMonth() &&
        day === today.getDate()) {
          dayBox.classList.add("bg-purple-300", 'dayBox', "font-bold", 'border-2', 'hover:scale-105', 'border-purple-500');
      }

    

    if (events.length > 0) {
      const dot = document.createElement("div");
      dot.className =
        "absolute bottom-1 right-2 w-2 h-2 bg-purple-600 rounded-full";
      dayBox.appendChild(dot);
    }

    daysContainer.appendChild(dayBox);
  }

 
  
  let clickedDay = null;

  daysContainer.addEventListener("click", (e) => {
    // daysContainer.querySelectorAll(".dayBox").forEach(box => {
    //   box.classList.remove("selected-day");
    // })
    // e.target.classList.add("selected-day")

    if (e.target.classList.contains("dayBox")) {
      modal.classList.remove("hidden");

      const clickedDate = parseInt(e.target.textContent);

      const month = (currentMonth + 1).toString().padStart(2, "0");
      const date = clickedDate.toString().padStart(2, "0");
      const dateKey = `${currentYear}-${month}-${date}`;

      clickedDay = `${currentYear}-${month}-${date}`;

      showEventsForDay(clickedDay);

      modal.classList.remove("hidden");
    }
   
  });


const addEventBtn = document.getElementById("add-event");

addEventBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const title = document.querySelector("#event-title").value;
  const time = document.querySelector("#event-time").value;
  const desc = document.querySelector("#event-desc").value;
  const color = document.querySelector("#event-color").value;

  if (!title || !time) {
    alert("Please enter event title and time");
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    time,
    desc,
    color,
  };

  const existingEvents = JSON.parse(localStorage.getItem(clickedDay)) || [];

  existingEvents.push(newEvent);

  localStorage.setItem(clickedDay, JSON.stringify(existingEvents));

  // console.log("Event saved:", newEvent);
  // console.log("✅ Event Saved for:", clickedDay);

  modal.classList.add("hidden");

  document.querySelector("#event-form").reset();
  alert("Event saved!!");
});
};renderCalendar()


//
const closeModalBtn = document.querySelector("#close-modal");
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


//
function showEventsForDay(datekey) {
  const eventList = document.querySelector("#event-list");
  eventList.innerHTML = "";

  const events = JSON.parse(localStorage.getItem(datekey)) || [];

  if (events.length === 0) {
    eventList.innerHTML = `<p class="text-gray-500">No events for this day.</p>`;
    return;
  }

  events.forEach((event, index) => {
    const eventItem = document.createElement("div");
    eventItem.className = `p-3 rounded shadow border-l-4`;
    eventItem.style.borderColor = event.color;

    eventItem.innerHTML = `
    <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-lg text-purple-700">${event.title}</h3>
          <p class="text-sm text-gray-600">${event.time}</p>
          <p class="text-sm text-gray-500">${event.desc}</p>
        </div>
        <button class="delete-btn text-red-500 text-xl font-bold" data-index="${index}">&times;</button>
      </div> 
   `;
    eventList.appendChild(eventItem);
  });


  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (confirm("Are you sure you want to delete this event?")) {
        const index = e.target.dataset.index;
        events.splice(index, 1);
        localStorage.setItem(datekey, JSON.stringify(events));
        showEventsForDay(datekey); // reload list
      }
    });
  });
}

//
const prevMonth = document.querySelector("#prev-month");
const nextMonth = document.querySelector("#next-month");

prevMonth.addEventListener("click", () => {
  currentMonth--;
  if(currentMonth < 0){
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});
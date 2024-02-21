var taskElements;
var date = new Date();
var gDay = date.getDay();if(gDay == 0) {gDay = 6}else {gDay--}
var gHour = date.getHours();
var gMinute = date.getMinutes();
var taskList;
var selectDays = document.querySelector('.days')
var colorAnimInterval;
var checkIcon = `
<use href="#check"></use>`;
var loadingIcon = `
<use href="#base"></use>
<use href="#body" class="rotate1"></use>
<use href="#effect" class="rotate2"></use>`;
var fillerIcon = `<svg class="svg-filler"></svg>`;

var events;

const bubbleSort = (arr, n) => {
    var i, j, temp;
    var swapped;
    for (i = 0; i < n - 1; i++) 
    {
        swapped = false;
        for (j = 0; j < n - i - 1; j++) 
        {
            if (arr[j].tag > arr[j + 1].tag) 
            {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
 
        if (swapped == false) break;
    }
    return arr;
}

const formatTime = (_hour, _minute, hasDash) => {
    if(!_hour) return "";
    var tempHour = _hour > 12 ? (_hour - 12).toString() : _hour.toString();
    var tempMinute = _minute < 10 ? "0" + _minute : _minute.toString();
    var ampm = _hour <= 12 ? 'am' : 'pm'
    var dash = hasDash ? ' - ' : '';

    return dash+tempHour+":"+tempMinute+ampm;
    
}

const actualTimeTag = (value) => {
    var sDay = gDay < 10 ? "0" + gDay.toString() : gDay.toString();
    var sHour = gHour < 10 ? "0" + gHour.toString() : gHour.toString();
    var sMinute = gMinute < 10 ? "0" + gMinute.toString() : gMinute.toString();

    switch(value) {
        case 'day':
            return sDay;
        case 'hour':
            return sHour;
        case 'minute':
            return sMinute;
        case 'dayhour':
            return sDay;
        case 'hourminute':
            return sHour+sMinute;
        default:
            return sDay+sHour+sMinute;
    }
}

const determineState = (event) => {
    var startHour = event.start.hour >= 10 ? event.start.hour.toString() : "0"+event.start.hour
    var startMinute = event.start.minute >= 10 ? event.start.minute.toString() : "0"+event.start.minute
    var endHour = event.end.hour >= 10 ? event.end.hour.toString() : "0"+event.end.hour
    var endMinute = event.end.minute >= 10 ? event.end.minute.toString() : "0"+event.end.minute
    if(actualTimeTag('hourminute') > startHour && event.end.hour == 0){
        return 'present'
    }else if (actualTimeTag("hourminute") > startHour+startMinute
        && actualTimeTag("hourminute") < endHour+endMinute){
        return 'present'
    }else if(actualTimeTag("hourminute") > endHour+endMinute && event.end.hour != 0){
        return 'past'
    }else {
        return 'future'
    }
}

const determineIcon = (state) => {
    if(state == 'past'){
        return `<svg viewBox="0 0 60 50" class="check-icon">${checkIcon}</svg`
    }else if(state == 'present'){
        return `<svg viewBox="0 0 60 60" class="loading-icon">${loadingIcon}</svg>`;
    }else {
        return fillerIcon;
    }
}

const renderTasks = () => {
    taskList = document.querySelector('.task-list')
    var segmentedEvents = [];
    events.forEach(event => {
        if(event.tag[0] == selectDays.value){
            segmentedEvents.push(event)
        }
    })

    for(i = 0; i < segmentedEvents.length; i++){
        var state = determineState(segmentedEvents[i]);
        taskList.innerHTML += 
        `<div id="task${segmentedEvents.id}" class="task full-opacity ${determineState(segmentedEvents[i]) == 'present' ? '' : 'half-opacity'} full-opacity">
            <div class="copy">
                <p class="title">${segmentedEvents[i].title}</p>
                <p class="time">${formatTime(segmentedEvents[i].start.hour, segmentedEvents[i].start.minute)} ${formatTime(segmentedEvents[i].end.hour, segmentedEvents[i].end.minute, true)}</p>
            </div>
            ${determineIcon(state)}
        </div>`
    }

    taskElements = document.querySelectorAll('.task')

    if(taskElements.length == 0){
        taskList.innerHTML += 
        `<div class="no-tasks">
            No hay tareas disponibles
        </div>`
    }

    return taskElements.length;
}

const scrollToPresentTask = () => {
    var totalScroll = 0;
    for(i = 0; i < taskElements.length; i++){
        var elementStyle = window.getComputedStyle(taskElements[i]);
        var marginTop = Number(elementStyle.marginTop.slice(0,-2));
        var height = Number(elementStyle.height.slice(0,-2));
        var paddingBottom = Number(elementStyle.paddingBottom.slice(0,-2));
        if(!taskElements[i].classList.contains('half-opacity')){
            taskList.scrollTop = totalScroll;
            break;
        }
        totalScroll += marginTop + height + paddingBottom;
    }
}

const randomColor = () => {
    var random = Math.random();
    if(random <= 0.33) return "#CCD8FF"
    else if (random >= 0.66) return "#FFDFCC";
    else return "#FFCCEE";
}

const showElements = () => {
    var counter = 0;
    const interval = setInterval(() => {
        taskElements[counter].classList.remove("full-opacity");
        counter++;
        if(counter == taskElements.length) clearInterval(interval)
    },75);
    document.querySelectorAll('svg')
        .forEach(svg => svg.style.fill = '#181818')
    colorAnimation();
}

const colorAnimation = () => {
    var counter = 0;
    const interval = setInterval(() => {

        var title = taskElements[counter].childNodes[1].childNodes[1];
        var time = taskElements[counter].childNodes[1].childNodes[3];
        var svg = taskElements[counter].childNodes[3];
        var color = randomColor();

        title.style.color = color;
        time.style.color = color;
        svg.style.fill = color;

        setTimeout(() => {
            title.style.color = "#e7e7e7";
            time.style.color = "#e7e7e7";
            svg.style.fill = "#e7e7e7";
        },3000)

        counter++;
        if(counter == taskElements.length) clearInterval(interval)
    },250);
}

const trigguer = () => {
    if(renderTasks() != 0){
        showElements();
        scrollToPresentTask();
        colorAnimInterval = setInterval(() => {
            colorAnimation();
        }, 4000)
    }
    setListeners();
}

const setListeners = () => {
    selectDays.addEventListener('change', () => {
        clearInterval(colorAnimInterval);
        taskList.innerHTML = ''
        trigguer();
    })
    
    document.querySelectorAll('.loading-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            if(icon.innerHTML != checkIcon){
                icon.innerHTML = checkIcon
            }else {
                icon.innerHTML = loadingIcon
            }
        })
    })
}

const getEvents = async (e) => {
    e.preventDefault();
    const req = await fetch(baseUrl + 'get-events',
    {
        method: 'GET',
    })
    events = await req.json();
    selectDays.value = gDay;
    bubbleSort(events, events.length);
    trigguer();
}


window.addEventListener('load', e => {
    getEvents(e);
})
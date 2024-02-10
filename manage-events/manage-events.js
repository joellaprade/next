var plusIcon = document.querySelector('.plus-icon');
var endTime = document.querySelector('.end-time');
var taskElements;
var date = new Date();
var gDay = date.getDay();if(gDay == 0) {gDay = 6}else {gDay--}
var gHour = date.getHours();
var gMinute = date.getMinutes();
var taskList;
var selectDays = document.querySelector('.days');
var colorAnimInterval;
var editIcon;
var deleteIcon;
var isModify = true;
var submitButton = document.querySelector('#submit');
var events;

const toggleFinalHour = () => {
    if(plusIcon.childNodes[1].style.opacity == '0'){
        endTime.style.width = '0%'
        plusIcon.childNodes[1].style.opacity = '1'
    }else {
        endTime.style.width = '100%'
        plusIcon.childNodes[1].style.opacity = '0'
    }
}

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
    var ampm = _hour < 12 ? 'am' : 'pm';
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
    if(actualTimeTag('hourminute') > startHour && event.end.hour == null){
        return 'present'
    }else if (actualTimeTag("hourminute") > startHour+startMinute
        && actualTimeTag("hourminute") < endHour+endMinute){
        return 'present'
    }else if(actualTimeTag("hourminute") > endHour+endMinute && event.end.hour != null){
        return 'past'
    }else {
        return 'future'
    }
}

const renderTasks = () => {
    var segmentedEvents = [];
    taskList = document.querySelector('.task-list')
    taskList.innerHTML = '';
    events.forEach(event => {
        if(event.tag[0] == selectDays.value){
            segmentedEvents.push(event)
        }
    })

    for(i = 0; i < segmentedEvents.length; i++){
        taskList.innerHTML += 
        `<div id="${segmentedEvents[i]._id}" class="task full-opacity">
            <div class="copy">
                <p class="title">${segmentedEvents[i].title}</p>
                <p class="time">${formatTime(segmentedEvents[i].start.hour, segmentedEvents[i].start.minute)} ${formatTime(segmentedEvents[i].end.hour, segmentedEvents[i].end.minute, true)}</p>
            </div>
            
            <svg id="${segmentedEvents[i]._id}" class="edit-icon" viewBox="0 0 55 42" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.13474 35.4289C7.69946 34.863 7.81784 34.0607 8.39915 33.637L16.2932 27.8825C16.8745 27.4587 17.6986 27.574 18.1339 28.1399C18.5691 28.7058 18.4508 29.5081 17.8695 29.9318L9.97541 35.6863C9.3941 36.1101 8.57001 35.9948 8.13474 35.4289Z"/>
                <path d="M19.4509 25.5808C18.8696 26.0045 18.7513 26.8068 19.1865 27.3727C19.6218 27.9386 20.4459 28.0539 21.0272 27.6301C21.6085 27.2064 21.7269 26.4041 21.2916 25.8382C20.8563 25.2723 20.0322 25.157 19.4509 25.5808Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M46.1635 0.511C47.3261 -0.336496 48.9743 -0.106004 49.8448 1.02582L53.7854 6.14918C54.656 7.281 54.4192 8.88556 53.2566 9.73305L49.0465 12.8021C49.0435 12.8043 49.0404 12.8065 49.0373 12.8087L43.7996 16.6269L43.7839 16.6384L11.1517 40.4261C10.8083 40.6764 10.4073 40.8411 9.98357 40.9059L3.04291 41.9674C0.95733 42.2864 -0.644715 40.2035 0.256747 38.345L3.25675 32.1602C3.43991 31.7826 3.71516 31.4543 4.05851 31.204L46.1635 0.511ZM43.5296 5.62934L47.7397 2.56034L51.6804 7.68371L47.4702 10.7527L43.5296 5.62934ZM41.4245 7.16393L40.372 7.93112L44.3126 13.0545L45.3651 12.2873L41.4245 7.16393ZM42.2076 14.5891L9.57543 38.3767L2.63477 39.4382L5.63477 33.2534L38.2669 9.46571L39.4491 11.0027L22.6084 23.2789C22.0271 23.7027 21.9088 24.5049 22.344 25.0709C22.7793 25.6368 23.6034 25.752 24.1847 25.3283L41.0253 13.052L42.2076 14.5891Z"/>
            </svg>
            <svg id="${segmentedEvents[i]._id}" fill="none" class="delete-icon" viewBox="0 0 39 42" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6688 15.6534C12.6377 15.0149 12.0864 14.522 11.4372 14.5525C10.7881 14.583 10.287 15.1254 10.318 15.7639L11.3104 36.2019C11.3414 36.8405 11.8928 37.3334 12.542 37.3029C13.1911 37.2724 13.6922 36.73 13.6612 36.0915L12.6688 15.6534Z"/>
                <path d="M28.8462 15.7639C28.8772 15.1254 28.3761 14.583 27.7269 14.5525C27.0778 14.522 26.5264 15.0149 26.4954 15.6534L25.503 36.0915C25.4719 36.73 25.973 37.2724 26.6222 37.3029C27.2713 37.3334 27.8227 36.8405 27.8537 36.2019L28.8462 15.7639Z"/>
                <path d="M20.7584 15.7087C20.7584 15.0694 20.2315 14.5512 19.5816 14.5512C18.9317 14.5512 18.4049 15.0694 18.4049 15.7087V36.2126C18.4049 36.8519 18.9317 37.3701 19.5816 37.3701C20.2315 37.3701 20.7583 36.8519 20.7583 36.2126L20.7584 15.7087Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2023 0C12.2527 0 10.6721 1.55466 10.6721 3.47244V4.96063H4.11611C2.16645 4.96063 0.585938 6.51529 0.585938 8.43307C0.585938 10.0909 1.767 11.4774 3.34662 11.8228L5.08806 37.219C5.27259 39.91 7.54551 42 10.2875 42H28.5396C31.2815 42 33.5545 39.91 33.739 37.219L35.4804 11.8228C37.06 11.4774 38.2411 10.0909 38.2411 8.43307C38.2411 6.51529 36.6606 4.96063 34.7109 4.96063H28.4911V3.47244C28.4911 1.55466 26.9106 0 24.9609 0H14.2023ZM26.1377 4.96063H13.0256V3.47244C13.0256 2.83318 13.5524 2.31496 14.2023 2.31496H24.9609C25.6108 2.31496 26.1377 2.83318 26.1377 3.47244V4.96063ZM4.11611 9.59055C3.46622 9.59055 2.93939 9.07233 2.93939 8.43307C2.93939 7.79381 3.46622 7.27559 4.11611 7.27559H34.7109C35.3608 7.27559 35.8877 7.79381 35.8877 8.43307C35.8877 9.07233 35.3608 9.59055 34.7109 9.59055H4.11611ZM7.43618 37.0632L5.71108 11.9055H33.116L31.3909 37.0632C31.2897 38.5389 30.0432 39.685 28.5396 39.685H10.2875C8.78381 39.685 7.53737 38.5389 7.43618 37.0632Z"/>
            </svg>
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
    },100);
    document.querySelectorAll('svg')
        .forEach(svg => {
            svg.style.fill = '#181818'
        })
    colorAnimation();
}


const colorAnimation = () => {
    var counter = 0;
    const interval = setInterval(() => {

        var title = taskElements[counter].childNodes[1].childNodes[1];
        var time = taskElements[counter].childNodes[1].childNodes[3];
        var svg1 = taskElements[counter].childNodes[3];
        var svg2 = taskElements[counter].childNodes[5];
        var color = randomColor();

        title.style.color = color;
        time.style.color = color;
        svg1.style.fill = color;
        svg2.style.fill = color;

        setTimeout(() => {
            title.style.color = "#e7e7e7";
            time.style.color = "#e7e7e7";
            svg1.style.fill = "#e7e7e7";
            svg2.style.fill = "#e7e7e7";
        },3000)

        counter++;
        if(counter == taskElements.length) clearInterval(interval)
    },250);
}

const trigguer = () => {
    if(renderTasks() != 0){
        showElements();
        colorAnimInterval = setInterval(() => {
            colorAnimation();
        }, 4000)
    }
    setListeners();
}

const toggleAddModify = () => {
    if(isModify){
        document.querySelector('.form-title').innerText = "Modificar Evento"
        document.querySelector('#submit').innerText = "Modificar"
        isModify = false;
    }else {
        document.querySelector('.form-title').innerText = "Agregar Evento"
        document.querySelector('#submit').innerText = "Agregar"
        isModify = true;
    }

}

const fillForm = (event) => {
    //asignar cada elemento aqui a una variable y despues poner caso para isModify == trye Y false
    var eventTitle = document.querySelector('.event-title');
    var eventDay = document.querySelector('.event-day');
    var startHour = document.querySelector('.start-time').childNodes[1];
    var startMinute = document.querySelector('.start-time').childNodes[5];
    var startAmpm = document.querySelector('.start-time').childNodes[7];
    var endHour = document.querySelector('.end-time').childNodes[1];
    var endMinute = document.querySelector('.end-time').childNodes[5];
    var endAmpm = document.querySelector('.end-time').childNodes[7];
    
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    eventTitle.value = event.title;
    eventDay.value = event.day;
    startHour.value = event.start.hour > 12 ? event.start.hour - 12 : event.start.hour
    startMinute.value = event.start.minute == 0 ? "0"+event.start.minute : event.start.minute;
    startAmpm.value = event.start.hour >= 12 ? 'pm' : 'am'
    if(event.end.hour != null){
        endHour.value = event.end.hour >  12 ? event.end.hour - 12 : event.end.hour
        endMinute.value = event.end.minute == 0 ? "0"+event.end.minute : event.end.minute;      
        endAmpm.value = event.end.hour >= 12 ? 'pm' : 'am'
    }
}

const setListeners = () => {
    selectDays.addEventListener('change', () => {
        clearInterval(colorAnimInterval);
        trigguer();
    })
    
    document.querySelectorAll('.loading-icon').forEach(icon => {
        icon.addEventListener('click', () => {            
            if(icon.innerHTML == loadingIcon){
                icon.innerHTML = checkIcon
            }else {
                icon.innerHTML = loadingIcon
            }
        })
    })

    plusIcon.addEventListener('click', toggleFinalHour)


    var editIcons = document.querySelectorAll('.edit-icon')
    var deleteIcons = document.querySelectorAll('.delete-icon')

    editIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            var id = icon.id
            events.forEach(event => {
                if(event._id == id){
                    toggleAddModify();
                    fillForm(event)
                } 
            })
        })
    })

    deleteIcons.forEach(icon => {
        var id = Number(icon.id.charAt(1))
        icon.addEventListener('click', () => {
            
        })
    })

}

var model = {
    title: '',
    day: 0,
    start: {
        hour: 0,
        minute: 0,
    },
    end: {
        hour: 0,
        minute: 0,
    },
    tag: ''
}

const serverTimeFormat = (hour, ampm) => {
    var formatedHour = ampm == 'am' ? hour : hour + 12;
    if (formatedHour == 24) formatedHour = 12
    return formatedHour;
}

const createTag = (model) => {
    var day = model.day
    var hour = model.start.hour
    var minute = model.start.minute

    hour = hour < 10 ? "0" + hour : hour.toString();
    minute = minute < 10 ? "0" + minute : minute.toString();

    return day+hour+minute;
}

const setValues = () => {
    var eventTitle = document.querySelector('.event-title');
    var eventDay = document.querySelector('.event-day');
    var startHour = document.querySelector('.start-time').childNodes[1];
    var startMinute = document.querySelector('.start-time').childNodes[5];
    var startAmpm = document.querySelector('.start-time').childNodes[7];
    var endHour = document.querySelector('.end-time').childNodes[1];
    var endMinute = document.querySelector('.end-time').childNodes[5];
    var endAmpm = document.querySelector('.end-time').childNodes[7];


    model.title = eventTitle.value;
    model.day = Number(eventDay.value);
    model.start.hour = serverTimeFormat(Number(startHour.value));
    model.start.minute = Number(startMinute.value);
    model.end.hour = endHour.value ? serverTimeFormat(Number(endHour.value)) : null;
    model.end.minute = endMinute.value ? Number(endMinute.value) : null;
    model.tag = createTag(model);

    return model;
}


const postEvent = async (e) => {
    e.preventDefault();
    const req = await fetch(baseUrl + 'create-event',
    {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(setValues())
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

submitButton.addEventListener('click', async e => {
    await postEvent(e);
    window.location.href = '/administrar'
})

window.addEventListener('load', e => {
    getEvents(e);
})
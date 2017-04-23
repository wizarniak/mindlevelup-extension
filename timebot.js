//These are the HTML selectors to edit the stuff in the first place

let answers = document.querySelector('.answers');
let questions = document.querySelector('.questions');
let Submit = document.querySelector('.Submit');
let enter = document.querySelector('.enter');
let reset = document.querySelector('.reset');

//Button Selectors
let make = document.querySelector('.make');
let schedule = document.querySelector('.schedule');


//These are the variables to keep the loop going when you're entering stuff
let asktask = true;



//These are the arrays that I'll use to make the schedule
let estimates = [];
let tasks = [];

//This is the counter for updating the Tasks
let counter = 1;


//Clearing the input field function
function clearThis(target) {
        target.value= "";
}

//Hiding certain elements, probs need to rewrite to hide lots of things
function hide() {
    let x = document.querySelector('.hidden');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function hide2() {
    let x = document.querySelector('.make');
    if (x.style.display === 'none') {
        x.style.display = 'inline';
    } else {
        x.style.display = 'none';
    }
}




//Defining the variables for break and work times
let askWork = true;
let askBreak = true;
let multiplierVar = 1.25;
let workTime = 45;
let breakTime = 5;





//The chatting function for inputs is here
function chat() {
    
    let ans = String(enter.value);
    
        if (askWork) {
            questions.innerHTML = ('How long do you want your break? (Enter in minutes)');
            askWork = false;
            let num1 = parseInt(ans, 10);
            workTime = num1;
            answers.innerHTML += 'Work Time: ' + num1 + ' min'+ '<br>';
            clearThis(enter);
        }
        else 
        if (askBreak) {
            questions.innerHTML = ('What is Task 1?');
            askBreak = false;
            let num2 = parseInt(ans, 10);
            breakTime = num2;
            answers.innerHTML += 'Break Time: ' + num2 + ' min'+ '<br>';
            clearThis(enter);
        }
        else
        if (asktask) {
            questions.innerHTML = ('How long do you think it will take? (Enter in minutes)');
            counter++;
            asktask = false;
            answers.innerHTML += 'Task:' + ' ' + (counter-1) + ' | ' + ans + ' ';
            clearThis(enter);
            tasks.push(ans);
        }
        else 
            {
                questions.innerHTML = ('What is Task ' + counter + '?' + '<br>');
                asktask = true;
                let time = parseInt(ans, 10);
                answers.innerHTML += ' | ' + 'Time:' + ' ' + time + ' min' + '<br>';
                clearThis(enter);
                estimates.push(time);
            }
}
enter.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        Submit.click();
    }
});
Submit.addEventListener("click", chat);




//Multiplier function to account for overconfident estimates
function multiplier(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.ceil((arr[i]*multiplierVar)/10)*10;
    }
}


//Displaying the array of times and updating the values
function chunk(timeArray, taskArray) {
    let total = 0;
    
    for(let i = 0; i < timeArray.length; i++) {
        
        if (taskArray[i] !== 'Take a break!') {
          total+= timeArray[i];
        }

        if (total > workTime) {
            let temp = timeArray[i];
            timeArray[i] = timeArray[i] - (total-workTime);
            
            timeArray.splice(i+1, 0, breakTime);
            taskArray.splice(i+1, 0, 'Take a break!');
            
            timeArray.splice(i+2, 0, (temp-timeArray[i]));
            taskArray.splice(i+2, 0, taskArray[i]);
            
            total = 0;
        }
    }
}

//This is the initial Start Time
let currTime = new Date(); 
let minute = Math.floor((Math.ceil((currTime.getMinutes()/10))*10)%60); 
let hour = currTime.getHours() + Math.floor((currTime.getMinutes() + 5)/60); 
let time = [];
time.push(hour, minute);
let startTime = time; //Apparently this is unsued, but it might be helpful in the future.
let endTime = time;


//This is the actual Get Time function
function getTime(timeElaps) {
    
    let starthrs = endTime[0] % 24;
    let startmin = endTime[1];
    if (startmin < 10) {
        startmin = '0'+startmin;
    }
    let startTimeString = (starthrs + ":" + startmin);
    
    endTime[0] = hrParse(endTime[0],endTime[1], timeElaps);
    endTime[1] = minParse(endTime[1], timeElaps);
    let endhrs = endTime[0] % 24;
    let endmin = endTime[1];
    if (endmin < 10) {
        endmin = '0'+endmin;
    }
    let endTimeString = (endhrs + ":" + endmin);
    
    let timeString = (startTimeString + " - " + endTimeString);
    
    return timeString;
}

function hrParse(hr, min, timeElaps) {
    return (hr + Math.floor((min + timeElaps)/60));
}

function minParse(min, timeElaps) {
    return ((min + timeElaps)%60);
}


function makeSchedule() {
    let timeArray = estimates;
    let taskArray = tasks;
    schedule.innerHTML += 'Schedule:' + '<br>';
    multiplier(timeArray);
    chunk(timeArray, taskArray);
    for (let i = 0; i < timeArray.length; i++) {
        if (taskArray[i] === 'Take a break!') {
            schedule.innerHTML += '<li class= "break">' + getTime(timeArray[i]) + ' -> ' + taskArray[i] + '<br>'+ '</li>';
        }
        else {
            schedule.innerHTML += '<li class= "schedule"><a href ="#">' + getTime(timeArray[i]) + ' -> ' + taskArray[i] + '<br>'+ '</a></li>';
        }
    }
    hide();
    hide2();
}
make.addEventListener("click", makeSchedule);


//This is the strike-through stuff
document.querySelector("li").addEventListener("click", function (e) {
    let li = e.target;
    
    if (li.style.textDecoration === "none") {
    li.style.textDecoration = "line-through";
    li.style.opacity = "0.25";
    }
    else {
        li.style.textDecoration = "none";
        li.style.opacity = "1.0";
    }
});



//This is the reset button to restart planning
function resetAll() {
    questions.innerHTML = 'How long do you want to work? (Enter in minutes)';
    answers.innerHTML = " ";
    schedule.innerHTML = " ";
    askWork = true;
    askBreak = true;
    counter = 1;
    tasks.length = 0;
    estimates.length = 0;
    hide();
    hide2();
}
reset.addEventListener("click", resetAll);
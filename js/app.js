const initialScreen = document.querySelector('.initial-screen');
const mainScreen = document.querySelector('.mainscreen');

const nameInput = document.getElementById('get-name-input');
const userNameDisplay = document.getElementById('username');

const timeDisplay = document.querySelector('.timedisplay');
const welcomeMsgDisplay = document.getElementById('welcometxt');

const focusFormContainer = document.querySelector('.focus-today');
const focusInput = document.getElementById('focus-input');
const todayFocusContainer = document.getElementById('todayfocus');
const focusMsgDisplay = document.getElementById('focusmsgdisp');

const cryptoContainer = document.getElementById('cryptocontainer');
const weatherContainer = document.getElementById('weathercontainer');
const weatherInfo = document.querySelector('.weather-info');
const currentLocation = document.querySelector('.currentlocation');

const bgImageInfoDisplay = document.querySelector('.image-info');
const quoteDisplay = document.querySelector('.quote-txt');

const todoToggle = document.getElementById('todotxt');
const todosContainer = document.querySelector('.newtodos');

const addToDoInput = document.getElementById('newtodo');
const todosList = document.querySelector('.todos');

const btn = document.getElementById('newbtn');


let is24Hours = false;
let todaysFocus = false;

const timerDisplayFormat = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    displayWelcomeMsg(hours);
  
    if (is24Hours) {
      timeDisplay.innerText = `${hours}:${minutes}`;
    } else {
      const suffix = hours >= 12 ? 'PM' : 'AM';
      let hours12 = hours % 12;
      if (hours12 === 0) {
        hours12 = 12;
      }
      timeDisplay.innerText = `${hours12}:${minutes} ${suffix}`;
    }
};

const chgTimeFormat = () => {
    is24Hours = !is24Hours;
    timerDisplayFormat();
};

/*
const displayWelcomeMsg = (hour) => {
    if (hour >= 3 && hour < 12) {
        welcomeMsgDisplay.textContent = "Good Morning";
    } else if (hour >= 12 && hour < 18)  {
        welcomeMsgDisplay.textContent = "Good Afternoon";
    } else {
        welcomeMsgDisplay.textContent = "Good Evening";
    }
}
*/

const displayWelcomeMsg = (hour) => {
    const greeting =
      hour >= 3 && hour < 12
        ? "Good Morning"
        : hour >= 12 && hour < 18
        ? "Good Afternoon"
        : "Good Evening";
    welcomeMsgDisplay.textContent = greeting;
};

const getFocus = () => {
    if (!todaysFocus) {
        todaysFocus = true;
        focusMsgDisplay.textContent = focusInput.value;
        saveTodaysFocus(focusInput.value);
        focusFormContainer.classList.add('hideme');
        todayFocusContainer.classList.remove('hideme');
    }
}

const deleteFocus = () => {
    if (todaysFocus) {
        focusMsgDisplay.textContent = '';
        focusFormContainer.classList.remove('hideme');
        todayFocusContainer.classList.add('hideme');
        todaysFocus = false;
        focusInput.value = '';
        removeLocalFocus();
    }
}

const getCrypto = async (e) => {
    try {
        const bitcoinRes = await fetch (`https://api.coingecko.com/api/v3/coins/bitcoin`);
        const bitcoindata = await bitcoinRes.json();
        
        const ethereumRes = await fetch (`https://api.coingecko.com/api/v3/coins/ethereum`);
        const ethereumdata = await ethereumRes.json();
        
        const tetherRes = await fetch (`https://api.coingecko.com/api/v3/coins/tether`);
        const tetherdata = await tetherRes.json();
        // console.log(data.urls.regular);
        cryptoContainer.innerHTML = `<div class='currentcoin'>
                                        <img src=${bitcoindata.image.small} />
                                        <p>$${bitcoindata.market_data.current_price.usd}</p>
                                    </div>
                                    <div class='currentcoin'>
                                        <img src=${ethereumdata.image.small} />
                                        <p>$${ethereumdata.market_data.current_price.usd}</p>
                                    </div>
                                    <div class='currentcoin'>
                                        <img src=${tetherdata.image.small} />
                                        <p>$${tetherdata.market_data.current_price.usd}</p>
                                    </div>`;
    
    }
    catch (error) {
        console.log(error.message);
    }
}

navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            // console.log(`Here is data: ${data}`);
            
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            weatherInfo.innerHTML = `
                <img src=${iconUrl} />
                <span>${Math.round(data.main.temp)}º</span>
            `
            currentLocation.innerText = data.name;
        })
        .catch(err => console.error(err));
});

const fetchBackground = async (e) => {
    try {
        const response = await fetch (`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature`);
        const data = await response.json();
        // console.log(data.urls.regular);
        document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(78, 78, 78, 0.1), rgba(10, 10, 10, 0.35)),url('${data.urls.regular}')`;

        bgImageInfoDisplay.innerHTML = `Image Credit:<br><a href="${data.links.html}" target="_blank">${data.user.name} / Unsplash</a>`;
    }
    catch (error) {
        console.log(error.message);
        document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(78, 78, 78, 0.1), rgba(10, 10, 10, 0.35)),url('../images/robert-lukeman-_RBcxo9AU-U-unsplash.jpg')`;

    }
}

const fetchQuotes = async (e) => {
    try {
        const response = await fetch (`../js/quotes.json`);
        const data = await response.json();

        quoteDisplay.innerText = data[Math.floor(Math.random()*data.length)].text;
        // console.log('Total Data: ' + data);
    }
    catch (error) {
        console.log(error.message);
    }
}

const toggleTodos = () => {
    todosContainer.classList.toggle('hideme');
}

const addToDos = (e) => {
    if (e.code === "Enter" && addToDoInput.value) { 
        e.preventDefault();
        let li = document.createElement('li');
        let i = document.createElement('i');

        let spanItem = document.createElement('span');

        i.classList.add('fa-solid', 'fa-trash', 'todoitem');

        spanItem.innerText = addToDoInput.value;

        todosList.appendChild(li);
        li.appendChild(i);
        li.appendChild(spanItem);

        // Add to localstorage
        saveToDosLocal(addToDoInput.value);

        addToDoInput.value = '';
    }
}

const setName = (e) => {
    if (e.code === "Enter" && nameInput.value) { 
        e.preventDefault();
        userNameDisplay.innerText = nameInput.value;

        saveNameLocal(nameInput.value);
        nameInput.value = '';

        initialScreen.classList.add('hideme');
        mainScreen.classList.remove('hideme');
    }
}

const saveNameLocal = (name) => {
    let username;
    if(localStorage.getItem('username') === null) {
        username = "";
    } else {
        username = JSON.parse(localStorage.getItem('username'));
    }
    username = name;
    localStorage.setItem('username', JSON.stringify(username));
}

const saveTodaysFocus = (focus) => {
    let todaysfocus;
    if(localStorage.getItem('todaysfocus') === null) {
        todaysfocus = [];
    } else {
        todaysfocus = JSON.parse(localStorage.getItem('todaysfocus'));
    }
    todaysfocus = focus;
    localStorage.setItem('todaysfocus', JSON.stringify(todaysfocus));
}

const checkTodaysFocus = () => {
    let todaysfocus;
    if (localStorage.getItem("todaysfocus") === null) {
        todaysfocus = "";
        focusMsgDisplay.textContent = '';
        focusFormContainer.classList.remove('hideme');
        todayFocusContainer.classList.add('hideme');
        focusInput.value = '';
    } else {
        todaysfocus = JSON.parse(localStorage.getItem("todaysfocus"));
        focusMsgDisplay.textContent = todaysfocus;
        focusFormContainer.classList.add('hideme');
        todayFocusContainer.classList.remove('hideme');
        todaysFocus = true;
    }
}

const removeLocalFocus = () => {
    localStorage.removeItem('todaysfocus');
}

const checkUserName = () => {
    let userName;
    if (localStorage.getItem("username") === null) {
        userName = [];
        mainScreen.classList.add('hideme');
    } else {
        userName = JSON.parse(localStorage.getItem("username"));
        userNameDisplay.innerText = userName;
        initialScreen.classList.add('hideme');
        mainScreen.classList.remove('hideme'); 
    }
}

const saveToDosLocal = (todo) => {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

const getToDos = () => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        let li = document.createElement('li');
        let i = document.createElement('i');

        let spanItem = document.createElement('span');

        i.classList.add('fa-solid');
        i.classList.add('fa-trash');
        i.classList.add('todoitem');

        spanItem.innerText = todo;

        todosList.appendChild(li);
        li.appendChild(i);
        li.appendChild(spanItem);

        addToDoInput.value = '';
    });
}

const removeLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }

    // console.log(todos);

    const todoIndex = todo.innerText;
    // console.log(todoIndex);
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeToDos = (e) => {
    const item = e.target;
    const todo = item.parentElement;
    todo.remove();
    removeLocalTodos(item);
}

focusInput.addEventListener("keydown", function (e) {
    //checks whether the pressed key is "Enter"
    if (e.code === "Enter") { 
        e.preventDefault();
        getFocus();
    }
});

document.addEventListener("DOMContentLoaded", getToDos);
document.addEventListener("DOMContentLoaded", checkUserName);
document.addEventListener("DOMContentLoaded", checkTodaysFocus);

todayFocusContainer.addEventListener('click', deleteFocus);

timeDisplay.addEventListener('click', chgTimeFormat);

window.setInterval(timerDisplayFormat, 1000);
todoToggle.addEventListener('click', toggleTodos);
addToDoInput.addEventListener('keydown', addToDos);
nameInput.addEventListener('keydown', setName);
todosList.addEventListener('dblclick', removeToDos);

getCrypto();
fetchQuotes();
fetchBackground();
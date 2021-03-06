# Profil Software Internship Task
Using free API to generate random user data from https://randomuser.me/  
Created by **Samuel Jędrzejewski**  
*samijedrzejewski@gmail.com*

# Functionalities

The goal is to write an application that will communicate with this API and have the following functionalities:

1) Display a button that should generate a new user.
2) Generated user should be displayed on the page. Present: first name, last name, picture, register date, nationality, and location address.
3) Clicking the button again should replace the previous user with the new one.
4) Add checkbox "Hide address". If the field is checked, you shouldn't fetch or display an address for this user.
5) Only fetch the data you need.
6) Create a separate page to display a table with the last 10 generated users. Display first name, last name, country, and registration date.
7) Allow sorting table by last name and registration date.
8) Data in the table should be saved after leaving the page (you can use e.g. localStorage) and set on init.

# Description

In this section I will present my solution to the given assesments. Notice: all the code in the blocks below are minified and are used only to show the purpose.

![Header preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/title.png)

## 1. Display a button that should generate a new user.

![Button preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/button.png)  

Simple styled button.

I used `querySelector()` to find the button, added `onclick` functionality and created function that allows calling another data fetching function.

```javascript
const generateUserButton = document.querySelector(".container-button");
generateUserButton.onclick = generateUserFromUrl;
function generateUserFromUrl( e ) {
    let url = e.target.dataset.url;
    fetchData( url );
}
```

## 2. Generated user should be displayed on the page.

![Data preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/data.png)  

Flex styled data.

I created html placeholders for all the data and load it after fetching API response by inserting `innerText` or `style.backgroundImage`.

```javascript
document.querySelector(".container-user__name-full").innerText = `${data.name.first} ${data.name.last}`;
document.querySelector(".container-user__created").innerText = `Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
document.querySelector(".container-user__picture").style.backgroundImage = `url("${imageSrc}")`;
document.querySelector(".container-user__name-nationality").style.backgroundImage = `url("${imageSrc}")`;
```

## 3. Clicking the button again should replace the previous user with the new one.

![Loading preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/loading.png)  

Simple loading animation.

Button click allows to regenerate data by fetching another request. I added simple loading animation to prevent images showing blank space instead of actual image.

```javascript
function loadImage( src ) {
    return new Promise( ( resolve, reject ) => {
        const image = new Image();
        image.addEventListener('load', resolve);
        image.addEventListener('error', reject);
        image.src = src;
    });
}
loadImage( imageSrc )
    .then( () => {
        document.querySelector(".container-user__picture").style.backgroundImage = `url("${imageSrc}")`;
    });
```

## 4. Add checkbox "Hide address".

![Checkbox preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/checkbox.png)  

Checkbox with own style.

I styled my own checkbox by setting `display: none;` on the checkbox and creating new mark by `::before` and `::after` pseudoelements.

```css
.container-address__label-check::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--accent-clr);
    opacity: 0;
    transition: opacity 100ms ease-in-out;
}
.container-address__label-check::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--secondary-clr);
    clip-path: polygon(37% 79%, 44% 87%, 53% 87%, 88% 49%, 87% 44%, 83% 40%, 77% 40%, 49% 72%, 33% 54%, 25% 56%, 21% 61%, 26% 67%);
    opacity: 0;
    transition: opacity 100ms ease-in-out;
}
```

## 5. Only fetch the data you need.

![Address preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/hidden.png)  

Hidden address field.

As I found in the *RandomUser* API documentation, it is easy to fetch all the data except not needed. I added unnecessary fields to the `?exc=` endpoint as well as adding another not to fetch locaton data when checkbox is ckecked.

```html
<a class="container-button" data-url="https://randomuser.me/api/?exc=cell,dob,email,gender,id,login,phone">Generate User</a>
```

```javascript
let url = e.target.dataset.url;
if( adddressCheckbox.checked ) url += ",location";
```

## 6. Create a separate page to display a table with the last 10 generated users

![Table preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/table.png)  

![Table preview on mobile](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/table-mobile.png)  

Responsive table with last 10 users.

I created two table views: one for the mobile users, one for desktop ones. Users are stored in the `localStorage` and after `window.onload` event is called, I append one by one to the original table.

```javascript
data.forEach( element => {
    row.append( firstName, lastName, country, registrationDate );
    containerTable.appendChild( row );
});
```

Data in the `localStorage` is stringified so I can easily parse it to the JSON and handle it within *JavaScript*.

```javascript
const data = JSON.parse( localStorage.getItem("random-data") );
```

```json
[
    0: {
        "name": { "title": "Mr", "first": "Miguel", "last": "Rodriquez" },
        "location": {
            "street": { "number": 6738, "name": "Photinia Ave" },
            "city": "Sacramento",
            "state": "Virginia",
            "country": "United States",
            "postcode": 48481,
            "coordinates": { "latitude": "88.2381", "longitude": "-64.7263" },
            "timezone": { "offset": "-7:00", "description": "Mountain Time (US & Canada)" }
        },
        "registered": {"date": "2008-07-07T05:05:13.387Z", "age": 14 },
        "picture": { "large": "https://randomuser.me/api/portraits/men/5.jpg", "medium": "https://randomuser.me/api/portraits/med/men/5.jpg", "thumbnail": "https://randomuser.me/api/portraits/thumb/men/5.jpg" },
        "nat":"US"
    }
]
```

## 7. Allow sorting table by last name and registration date.

![Sorting preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/sort.png)  

![Sorting preview on mobile](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/sort-mobile.png)  

Table sorting.  

Sorting the table by `String.prototype.sort()` method. Removing loaded data and appending sorted rows instead. On mobile there is a button added to select right sort option. On desktop it is easy to sort by specific column by clicking on it.

```javascript
function sortData( data, column, parameter ) {
    switch( column ) {
        case "lastName":
            data.sort( ( item1, item2 ) => {
                return parameter == "asc" ? item1.name.last.localeCompare( item2.name.last ) : item2.name.last.localeCompare( item1.name.last );
            });
            break;
        case "registrationDate":
            data.sort( ( item1, item2 ) => {
                return parameter == "asc" ? new Date( item1.registered.date ) - new Date( item2.registered.date ) : new Date( item2.registered.date ) - new Date( item1.registered.date );
            });
            break;
    }
    return data;
}
```

## 8. Data in the table should be saved after leaving the page and set on init.

![Local storage preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/localStorage.png)  

Data stored in local storage. 

Generated users data is stored in `localStorage` as well as information about sorting. Initially data is sorted by generating order but after interacting with any sort type it will be displayed in that order after reloading page.

```javascript
loadData( sortData( data, sortedBy.column, sortedBy.parameter ) );
```

```javascript
function loadData( data ) {
    const itemClassName = "container-table__item";
    if( data === null ) return containerTable.append("No data to show.");
    data.forEach( async element => {
        const date = new Date( element.registered.date );
        let countries;
        await await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json").then( response => response.json() ).then( json => countries = json );
        let row = document.createElement("div");
        let firstName = document.createElement("div");
        let lastName = document.createElement("div");
        let registrationDate = document.createElement("div");
        let country = document.createElement("div");
        row.className = "container-table__item table-row";
        firstName.classList.add( itemClassName, "table-firstName" );
        firstName.dataset.label = "First Name";
        lastName.classList.add( itemClassName, "table-lastName" );
        lastName.dataset.label = "Last Name";
        country.classList.add( itemClassName, "table-country" );
        country.dataset.label = "Country";
        registrationDate.classList.add( itemClassName, "table-registrationDate" );
        registrationDate.dataset.label = "Registration Date";
        firstName.innerText = element.name.first;
        lastName.innerText = element.name.last;
        country.innerText = countries.reduce( ( final, next ) => { return element.nat == next['alpha-2'] ? next.name : final } );
        registrationDate.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        row.append( firstName, lastName, country, registrationDate );
        containerTable.appendChild( row );
    });
}
```

# Hosting website application

There is a way to host a website locally.

## Installing

Website can be hosted by *Node.js*. *NPM* modules should be downloaded fisrt.  

```bash
npm install
```

I used following dependencies to host a web application:

```json
"dependencies": {
    "express": "^4.17.3",
    "nodejs": "0.0.0",
    "open": "^8.4.0",
    "path": "^0.12.7"
},
```

## Running

In package there is `start` command defined so it is easy to execute it by *npm*.

```bash
npm start
npm run start
node index.js
```

![Console preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/host.png)  

Default `host` and `port` are stored in constants.

```javascript
const host = "localhost";
const port = 3000;
```

## Application

Application is run by *expressjs* and it is using static webpage. `open` package starts browser on specific address.

```javascript
app.use( express.static( path.join( __dirname, "public" ) ) );
app.listen( port, host, () => {
    console.log(`App running on ${host}:${port}/`);
    open(`http://${host}:${port}`);
});
```

# Testing

I used `cypress` framework to handle integration tests.

## Instalation

Building application should also include testing library. Another dependencies has been added:  

```json
"dependencies": {
    "cypress": "^9.5.1",
    "cypress-localstorage-commands": "^1.7.0"
}
```

## Running

Test run by `Cypress` are easy to execute by in-build programme. To reach the GUI use *npm*.

```bash
npm test
npx cypress open
```

![Console preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/test.png)  

The programme will show up and tests should be loaded. To execute them, just click `Run 1 integration spec` or click right on the test file.

![Cypress preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/cypress.png)  

Selected browser will appear and tests will run.

## Tests

I seperated tests by device so there are two different ways to test. Features being tested:

1) First time on page
2) Generating 5 users
3) Sorting results
4) Generate users with showed and hidden address

### Desktop

![Desktop tests preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/tests-desktop.png)  

### Mobile

![Mobile tests preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/tests-mobile.png)  
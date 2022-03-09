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

In this section I will present my solution to the given assesments.

![Generated data preview](https://raw.githubusercontent.com/238SAMIxD/profil-software-internship/main/img/title.jpg?token=GHSAT0AAAAAABRGFU5VXAX6SSRUGA4Y75VOYRR5ADQ)

## 1. Display a button that should generate a new user.

![Button preview](https://github.com/238SAMIxD/profil-software-internship/blob/main/img/button.png) Simple styled button.

I used `querySelector()` to find the button, added `onclick` functionality and created function that allows calling another data fetching function.

```javascript
const generateUserButton = document.querySelector(".container-button");
generateUserButton.onclick = generateUserFromUrl;
async function generateUserFromUrl( e ) {
    let url = e.target.dataset.url;
    fetchData( url );
}
```

## 2. Generated user should be displayed on the page.

![Generated data preview](https://raw.githubusercontent.com/238SAMIxD/profil-software-internship/main/img/data.jpg?token=GHSAT0AAAAAABRGFU5VXAX6SSRUGA4Y75VOYRR5ADQ) Flex styled data.

I created html placeholders for all the data and load it after fetching API response by inserting `innerText`.

```javascript
document.querySelector(".container-data__firstName > .data").innerText = data.name.first;
document.querySelector(".container-data__lastName > .data").innerText = data.name.last;
document.querySelector(".container-data__picture").style.backgroundImage = `url(${data.picture.large}`;
document.querySelector(".container-data__registerDate > .data").innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
document.querySelector(".container-data__nationality > .data").innerText = data.nat;
```

## 3. Clicking the button again should replace the previous user with the new one.

As simple as that. Code from 1st and 2nd points does it every time after clicking.

## 4. Add checkbox "Hide address".

![Generated data preview](https://raw.githubusercontent.com/238SAMIxD/profil-software-internship/main/img/checkbox.jpg?token=GHSAT0AAAAAABRGFU5VXAX6SSRUGA4Y75VOYRR5ADQ) Checkbox with own style.

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

![Generated data preview](https://raw.githubusercontent.com/238SAMIxD/profil-software-internship/main/img/hidden.jpg?token=GHSAT0AAAAAABRGFU5VXAX6SSRUGA4Y75VOYRR5ADQ) Hidden address field.

As I found in the *RandomUser* API documentation, it is easy to fetch all the data except not needed. I added unnecessary fields to the `?exc=` endpoint as well as adding another not to fetch locaton data when checkbox is ckecked.

```html
<a class="container-button" data-url="https://randomuser.me/api/?exc=cell,dob,email,gender,id,login,phone">Generate User</a>
```

```javascript
let url = e.target.dataset.url;
if( adddressCheckbox.checked ) url += ",location";
```

## 6. Create a separate page to display a table with the last 10 generated users

***In progress***

## 7. Allow sorting table by last name and registration date.

***In progress***


## 8. Data in the table should be saved after leaving the page and set on init.

***In progress***
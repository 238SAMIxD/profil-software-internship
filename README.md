# Profil Software Internship Task
Using free API to generate random user data from https://randomuser.me/
Created by **Samuel Jędrzejewski**

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

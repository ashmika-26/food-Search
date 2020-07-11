# foodSearch
foodSearch is a vanilla JavaScript application that interacts with the forkify API to fetch and display recipe food data. 
This app uses modern JavaScript tools, such as Webpack to bundle the modules, and Babel to convert ES6, ES7 and ES8 back to ES5. 
The user can search for a specific recipe, and add ingredients to a shopping list or save to a favourites list via local storage. 
I created a simple Express server in order to host the app via Heroku.

The app is deployed and available to use -

https://food--search.herokuapp.com/

This project was from Jonas Schmedtmann's 'The Complete JavaScript Course' on Udemy. My additional features and code refactoring include -

Clear Shopping List Button.
I added a clear shopping list button, allowing the user to clear the list completely, compared to deleting items one at a time.

Check for duplicated items in shopping list.
The original app did not check whether ingredients were already in the list, therefore the user could end up with the same ingredient multiple times. 
I refactored the addItem function in List.js to check if the item being added was already present in the list array.
If so, then the item that is already present in the shopping list has it's count value doubled.

Save shopping list data in local storage.
When the page re-loads, the user's shopping list is restored, along with the likes list as well.

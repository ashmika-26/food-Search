
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
* - Search object
* - current recipe object
* - shopping list object
* - Liked recipe
*/

const state = {};

// Search Controller
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();


  if (query){
    // 2) New search object add to state
    state.search = new Search(query);

    // 3) Prepare UI for getResults
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    }

    catch(err){
      alert("Something went wrong with you search... Please search for another recipe!");
      clearLoader();
    }
  }
};



elements.searchForm.addEventListener('submit',e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click',e => {
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt( btn.dataset.goto,10);
    searchView.clearResults();
    searchView.renderResults(state.search.result,goToPage);
  }
});

// Recipe Controller
const controlRecipe = async () => {
  const id = window.location.hash.replace('#','');


  if(id){

    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if(state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      // Calculate serving and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Render Recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
    }

    catch (err){
      alert("Error processing recipe!");
    }

  }
};

//------------------
// LIST CONTROLLER
//------------------
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        if (item.ingredient) {
                listView.renderItem(item);
            } else {
                // If item does not include an ingredient property, then the item is already included in the list, so update the count in the state and double the count on the item in the list on the UI
                state.list.updateCount(item.id, item.count);
                listView.updateCount(item.id, item.count);
            }

    });

  listView.removeClearBtn();
   listView.renderClearBtn();
};

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    // Find out id of item that was clicked.
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete item button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // If list is empty, remove
        if (state.list.items.length === 0) {
            listView.removeClearBtn();
        }

        // Delete from UI
        listView.deleteItem(id);

        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        // Grab count value and convert to number
        const val = parseFloat(e.target.value, 10);
        // Update count by passing in value and id
        state.list.updateCount(id , val);
    }
});

elements.shopping.addEventListener('click', e => {

    if (e.target.matches('.list_btn_delete-small, .list_btn_delete-small *')) {
        // Delete from state
        state.list.deleteAllItems();

        // Delete from UI
        listView.deleteAllItems();
        listView.removeClearBtn();
    }
});


/**
* LIKE Controller
*/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likeView.toggleLikeBtn(true);

        // Add like to UI list
        likeView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likeView.toggleLikeBtn(false);

        // Remove like from UI list
        likeView.deleteLike(currentID);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new List();

    // Restore likes
    state.likes.readStorage();
    state.list.readStorage();

    // Toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());


    // Render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));
    state.list.items.forEach(item => listView.renderItem(item));

    if (state.list.items.length > 0) {
        listView.renderClearBtn();
    }
});

//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));



// Handling recipe button clicks
elements.recipe.addEventListener('click',e => {

  if (e.target.matches('.btn-decrease, .btn-decrease *')){
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  }

  else if (e.target.matches('.btn-increase, .btn-increase *')){
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  }
  else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
      }

  else if (e.target.matches('.recipe__love, .recipe__love *')){
        // Like CONTROLLER
        controlLike();
  }
});

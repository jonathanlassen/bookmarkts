'use strict';
/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  const googleIcons = ["looks_one", "looks_two", "looks_3", "looks_4", "looks_5" ];


  function generateItemElement(item) {
    const checkedClass = item.checked ? 'shopping-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';

    let itemTitle = `<span class="shopping-item ${checkedClass}">${item.title}</span>`;
    let itemUrl = `<span class="shopping-item ${checkedClass}">${item.url}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item type="text" value="${item.title}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        <div>
      
          <i style="float:right" class="material-icons">
          ${googleIcons[(parseInt(item.rating)-1)]}
          </i>
          ${itemTitle}
        </div>
        <div style="clear:both;">
          <img style="float:right" src="https://image.thum.io/get/width/200/crop/600/${item.url}">
          ${itemUrl}
        </div>

        <div  style="clear:both;">  ${item.desc}
        </div>
       
        <div class="shopping-item-controls">
          <button class="shopping-item-edit js-item-edit" ${editBtnStatus}>
            <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
        
      </li>`;
  }
  
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false

    $('.shopping-list-error').html('');

    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM

    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
    if(store.error) {
      $('.shopping-list-error').html(store.error);
    }
  }

  //https://image.thum.io/get/width/200/crop/600/https://www.google.com
  
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newTitle = $('.bookmark-title-form').val();
      const newUrl = $('.bookmark-url-form').val();
      const newDesc = $('.bookmark-desc-form').val();
      const newRatings = $('.bookmark-ratings-form').val();
      $('.js-shopping-list-entry').val('');
      api.createItem({title: newTitle, url: newUrl, desc: newDesc, rating: newRatings})
        .then((newItem) => {
          store.addItem(newItem);
          render();
        }).catch(err => {
          store.setError(err.message);
          render();
        });
    });
  }
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemToCheck = store.findById(id);
      api.updateItem(id, {checked: !itemToCheck.checked})
        .then((newItem) => {
          store.findAndUpdate(id, {checked: !itemToCheck.checked});
          render();
        }).catch(err => {
          store.setError(err.message);
          render();
        });
    });
  }
  
  function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteItem(id)
        .then((newItem) => {
          store.findAndDelete(id);
          render();
        }).catch(err => {
          store.setError(err.message);
          render();
        });
    });
  }
  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();

        api.updateItem(id, {name: itemName})
        .then((newItem) => {
          store.findAndUpdate(id, {name: itemName});
          render();
        }).catch(err => {
          store.setError(err.message);
          render();
        });
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleItemStartEditing();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
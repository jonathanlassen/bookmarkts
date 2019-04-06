'use strict';
/* global store, api, $ */
// eslint-disable-next-line no-unused-vars
const bookmarks = (function(){

  const googleIcons = ["looks_one", "looks_two", "looks_3", "looks_4", "looks_5" ];


  function generateItemElement(item) {
    const checkedClass = item.checked ? 'bookmarks-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';
    let unCollapseCard ='';
    let arrow=''
    if (item.hidden)
    {
       unCollapseCard ='';
       arrow ='keyboard_arrow_up';
      console.log('hi')
    } else {

       unCollapseCard ='hidden';
       arrow ='keyboard_arrow_down';
      console.log('hi')
    }

    console.log(item)

    let itemTitle = `<span class="bookmarks-item ${checkedClass}">${item.title}</span>`;
    let itemUrl = `<span class="bookmarks-item ${checkedClass}">${item.url}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item ">
          <input class="bookmarks-item type="text" value="${item.title}" />
        </form>
      `;
    }
  
    return `
      <div class="card js-item-element" data-item-id="${item.id}">
        <div class="toggleCollapse">
          <i style="float:right" class="material-icons ">
          ${googleIcons[(parseInt(item.rating)-1)]}
          </i>
          <i style="float:right; padding-left: 10px; " class="material-icons ">
           ${arrow}
          </i>
          ${itemTitle}
        </div>
        
        <div class="bottom-card ${unCollapseCard}">
          <div style="clear:both; padding-top: 15px;">
            <img class="link-image" src="https://image.thum.io/get/width/200/${item.url}">


            <div style="float: left; max-width: 200px;">  
            ${item.desc}
            </div>
            

            <div style="clear: both; padding-top: 10px;">
              <i style="float:right; padding-top: 10px;" class="material-icons js-item-delete">
                    delete
              </i>
              <a class="button" style="float: left;" href="${item.url}">SITE</a>
            </div>
          </div>       
         
        </div>
        
      </div>`;
  }
  
  
  function generatebookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false

    $('.bookmarks-list-error').html('');

    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the bookmarks list in the DOM

    const bookmarksListItemsString = generatebookmarksItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-bookmarks-list').html(bookmarksListItemsString);
    if(store.error) {
      $('.bookmarks-list-error').html(store.error);
    }
  }
  
  function handleNewItemSubmit() {
    $('#js-bookmarks-list-form').submit(function (event) {
      event.preventDefault();
      const newTitle = $('.bookmark-title-form').val();
      const newUrl = $('.bookmark-url-form').val();
      const newDesc = $('.bookmark-desc-form').val();
      const newRatings = $('.bookmark-ratings-form').val();
      $('.js-bookmarks-list-entry').val('');
      api.createItem({title: newTitle, url: newUrl, desc: newDesc, rating: newRatings, test: 'hello'})
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
    $('.js-bookmarks-list').on('click', '.js-item-toggle', event => {
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
    $('.js-bookmarks-list').on('click', '.js-item-delete', event => {
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
  
  function handleEditbookmarksItemSubmit() {
    $('.js-bookmarks-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.bookmarks-item').val();

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
  
  function handlebookmarksListSearch() {
    $('.js-bookmarks-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-bookmarks-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }

  function handleToggleCollapse() {
    $('.js-bookmarks-list').on('click', '.toggleCollapse', event => {
      const id = getItemIdFromElement(event.target);
      store.toggleItemCollapse(id);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditbookmarksItemSubmit();
    handleToggleFilterClick();
    handlebookmarksListSearch();
    handleItemStartEditing();
    handleToggleCollapse();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
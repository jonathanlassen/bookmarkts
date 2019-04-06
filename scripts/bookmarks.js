'use strict';
/* global store, api, $ */
// eslint-disable-next-line no-unused-vars
const bookmarks = (function(){

  const googleIcons = ["looks_one", "looks_two", "looks_3", "looks_4", "looks_5" ];
  function generateItemElement(item) {
    let unCollapseCard ='';
    let arrow='';
    if (item.hidden)
    {
       unCollapseCard ='';
       arrow ='keyboard_arrow_up';

    } else {

       unCollapseCard ='hidden';
       arrow ='keyboard_arrow_down';  
    }

    let itemTitle = `<span class="bookmarks-item ">${item.title}</span>`;
    let itemUrl = `<span class="bookmarks-item ">${item.url}</span>`;
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
          <i style="float:right; color: #374a6d;" class="material-icons ">
          ${googleIcons[(parseInt(item.rating)-1)]}
          </i>
          <i style="float:right; padding-left: 10px; color: #374a6d;" class="material-icons ">
           ${arrow}
          </i>
          ${itemTitle}
        </div>
        
        <div class="bottom-card ${unCollapseCard}">
          <div style="clear:both; padding-top: 15px;">
            <img class="link-image" src="https://image.thum.io/get/width/200/${item.url}">


            <div class="description-div">  
            ${item.desc}
            </div>
          
            <div class="card-footer" >
              <i style="" class="material-icons js-item-delete">
                    delete
              </i>
              <a class="button" style="float: left;" href="${item.url}">visit site</a>
            </div>
          </div>       
         
        </div>
        
      </div>`;
  }
  
  
  function generatebookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
  }

  function renderNav()
  {
    $('.left-column').html('');
    const navrender = `<div class="top-label">
    <label for="min-rating" >Min Bookmark Rating</label>
    <select id="min-rating" class="min-rating"  name="min-rating">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <button type="button" class="button-to-add-bookmarket">Add item</button>
    </div>
      <div id="add-section" class="add-section hidden ">
        <div class="bookmarks-list-error" style="color: red"></div>
        <form id="js-bookmarks-list-form" class="add-form">
          <label for="bookmark-title">Title</label>
          <input type="text" name="bookmark-title" id="bookmark-title" class="bookmark-title-form form" placeholder="">
          <label for="bookmark-list-entry">URL</label>
          <input type="text" name="bookmark-url" class="bookmark-url-form form" placeholder="">
          <label for="bookmark-desc">Description</label>
          <textarea  name="comment" class="bookmark-desc-form form textarea"></textarea>     
          <label for="Rating">Rating</label>
          <select id="myselect" class="bookmark-ratings-form select-form"  name="rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <div class="bottom-button-div">
            <button type="submit" class="submit-button">Submit</button>
            <button type="button" class="cancel-button hidden">Cancel</button>
          </div>
        </form>
      </div>`;
      $('.left-column').html(navrender);
  }
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let temp_items = [];
    $('.bookmarks-list-error').html('');

    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }

    temp_items = items;

    if (store.minRating) {
      temp_items = items.filter(item => item.rating >= store.minRating);
    }
    const bookmarksListItemsString = generatebookmarksItemsString(temp_items  );
    $('.js-bookmarks-list').html(bookmarksListItemsString);
    if(store.error) {
      $('.bookmarks-list-error').html(store.error);
    }
  }
  
  function handleNewItemSubmit() {
    $('.left-column').on('submit', event => {
      event.preventDefault();
      const newTitle = $('.bookmark-title-form').val();
      const newUrl = $('.bookmark-url-form').val();
      const newDesc = $('.bookmark-desc-form').val();
      const newRatings = $('.bookmark-ratings-form').val();
      api.createItem({title: newTitle, url: newUrl, desc: newDesc, rating: newRatings, test: 'hello'})
        .then((newItem) => {
          store.addItem(newItem);
          store.setMinRating('1');
          render();
          renderNav();
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
  
  function handleToggleCollapse() {
    $('.js-bookmarks-list').on('click', '.toggleCollapse', event => {
      const id = getItemIdFromElement(event.target);
      store.toggleItemCollapse(id);
      render();
    });
  }

  function handleToggleShowAdd() {
    $('.left-column').on('click', '.button-to-add-bookmarket', event => {
      event.preventDefault();
        $('#add-section').removeClass("hidden");
        $('.cancel-button').removeClass("hidden");
        $('.button-to-add-bookmarket').addClass("hidden");
    });
  }

  function handleToggleHideAdd() {
    $('.left-column').on('click', '.cancel-button', event => {
      event.preventDefault();
        $('#add-section').addClass("hidden");
        $('.cancel-button').addClass("hidden");
        $('.button-to-add-bookmarket').removeClass("hidden");
    });
  }

  function handleMinRatingChange() {
    $('.left-column').on('change', '.min-rating', function() {
        store.setMinRating(this.value);
        render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleDeleteItemClicked();
    handleToggleCollapse();
    handleToggleShowAdd();
    handleToggleHideAdd();
    handleMinRatingChange();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    renderNav: renderNav,
    bindEventListeners: bindEventListeners,
  };
}());
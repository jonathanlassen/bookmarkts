'use strict';
/* global bookmarks, store, api, $ */

$(document).ready(function() {
  bookmarks.bindEventListeners();
  bookmarks.render();
  api.getItems()
    .then((items) => {

      items.forEach((item) => store.addItem(item));
      bookmarks.render();
    });
});
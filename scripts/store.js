'use strict';
/* global Item */

// eslint-disable-next-line no-unused-vars
const store = (function(){
  const addItem = function(item) { 
    this.items.push(item);
    
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };


  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };


  const toggleItemCollapse = function(id) {
   

    const foundItem = this.findById(id);

   foundItem.hidden = !foundItem.hidden;

  };

  const setError = function(term) {
    this.error = term;
  };

  const setMinRating = function (rating){
    store.minRating = rating;
  };

  return {
    items: [],
    error:'',
    addItem,
    findById,
    findAndDelete,
    setError,
    toggleItemCollapse,
    setMinRating
  };
  
}());
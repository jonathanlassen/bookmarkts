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

  const findAndUpdate = function(id, newData){
    Object.assign(this.items.find(item => item.id === id), newData); 
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };


  const toggleCheckedFilter = function() {
    this.hideCheckedItems = !this.hideCheckedItems;
  };

  const toggleItemCollapse = function(id) {
   

    const foundItem = this.findById(id);

   foundItem.hidden = !foundItem.hidden;

  };

  const setItemIsEditing = function(id, isEditing) {
    const item = this.findById(id);
    item.isEditing = isEditing;
  };

  const setSearchTerm = function(term) {
    this.searchTerm = term;
  };

  const setError = function(term) {
    this.error = term;
  };

  return {
    items: [],
    hideCheckedItems: false,
    error:'',
    searchTerm: '',
    findAndUpdate,
    addItem,
    findById,
    findAndDelete,
    toggleCheckedFilter,
    setSearchTerm,
    setItemIsEditing,
    setError,
    toggleItemCollapse
  };
  
}());
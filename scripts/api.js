'use strict';
/* global store */

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jonathan';


  const getItems = function() {

    return listApiFetch(BASE_URL+'/bookmarks')
      .then(response => {
        return response;
      });

  };

  function listApiFetch(...args) {
    let error;


    store.setError('');
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!

          error = { code: res.status };
        }
  
        // In either case, parse the JSON stream:
        
        return res.json();
      })
  
      .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
      
          error.message = data.message;
          return Promise.reject(error);
        }
  
        // Otherwise give back the data as resolved Promise
        return data;
      });
  }


  const createItem = function (args) {

    return listApiFetch(BASE_URL + '/bookmarks',  
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
      }
    );
  }

  const deleteItem = function (id){

    return listApiFetch(BASE_URL+'/bookmarks/'+id, {
      // eslint-disable-next-line quotes
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });


  };

  const updateItem = function (id, updateData){

    return listApiFetch(BASE_URL+'/bookmarks/'+id, {
      // eslint-disable-next-line quotes
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

  };

  return {
    getItems,
    createItem,
    deleteItem,
    updateItem,

  };

}());


(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
    var ddo = {
        tempalteUrl: 'foundItems.html',
        restrict: 'E',
        scope: {
            foundItems: '<',
            onRemove: '&'
        }
    }; 
    return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
    var menuSearch = this;

    menuSearch.notValid = false;
    menuSearch.searchTerm = "";

    menuSearch.search = function() {

        if (searchIsEmpty(menuSearch.searchTerm))
        {
            menuSearch.notValid = true;
            return;
        };

        var searchForItems = MenuSearchService.getMatchedMenuItems(menuSearch.searchTerm);

        searchForItems.then( function (result) {
            menuSearch.found = result;
            menuSearch.notValid = (result.length === 0);
        })
        .catch(function(error) {
            console.log("MenuSearchService.getMatchedMenuItems returned an error");
        });
    };

    menuSearch.removeItem = function (itemIndex) {
        menuSearch.found.splice(itemIndex, 1);
    };


    function searchIsEmpty (searchString)
    {
        return searchString.replace(/\s/g,"").length === 0;
    };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService ($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {

        return $http({
            method: "GET",
            url: (ApiBasePath + "/menu_items.json")
        }).then(function (response) {

            var allMenuItems = response.data.menu_items;

            return allMenuItems.filter( function (item) {
                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
            });

        })
        .catch(function(error) {
            console.log("GET menu_items.json returned an error");
        });

    };

}

})();
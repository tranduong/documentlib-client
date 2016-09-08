'use strict';

angular
    .module('SDLMSys')
	.constant("DEPLOYED_HOST", {"URL": "http://localhost:3001"}) // Change when you have a new 
	.constant("SEARCH_HOST", {"URL": "http://192.168.0.108:9200", "MULTI_API" : "_msearch", "SINGLE_API" : "_search"}) // Change when you have a new 
	.constant("PAGINATION", {"ITEMS_PER_PAGE": 10});

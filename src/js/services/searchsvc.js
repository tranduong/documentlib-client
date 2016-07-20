'use strict';
angular
    .module('SDLMSys')
    .factory('SearchSvc', ['$http', '$localStorage', 'SEARCH_HOST', SearchSvc]);
	
function SearchSvc($http, $localStorage, SEARCH_HOST)
{	
	return {
		searchData: function(query, privacy, category, demomode, fromPage, size, successCallback, errorCallback)
		{
			var searchURL = SEARCH_HOST.URL + '/' + SEARCH_HOST.MULTI_API;
			var searchBody = "";
			var currentUser = $localStorage.myDetail;
			if ( undefined === query ) query = "*";
			var categoryFilter = ""
			var categoryFilter_prefix = ""
			var categoryFilter_subfix = "";
								
			if (undefined !== category && category !== "all" && category !== "")
			{
				categoryFilter = '"filter": {"match": {"category": { "query":    "' + category + '","operator": "and"}}}, "must" : ';	
				categoryFilter_prefix = '{ "query" : {"bool" : {';
				categoryFilter_subfix = '}}}'; 
			}
			// base on privacy and demomode
			if ( privacy === "pubnpri" ) // <option value="pubnpri">my Public and my Private</option>
			{
				console.log("my Public and my Private");
				// base on the demomode generate the searchURL and searchBody for multi index
				if ( demomode === '2' ) // <option value="2">Custom routing with one index and 3 public/private/share types</option>									
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib2", "type":"Document_public", "routing" : "' + currentUser._id + '", "pretty": "true" }\r\n' +
									 categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
						// my private document
						searchBody = searchBody + '{ "index" : "doclib2", "type":"Document_private", "routing" : "' + currentUser._id + '", "pretty": "true" }\r\n' +
									 categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';				
					}
					console.log("Custom routing with one index and 3 public/private/share types");
				}
				else if ( demomode === '3' ) // <option value="3">Separate indexes for users</option>							
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib3_' + currentUser._id + '_public", "type":"Document", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
						// my private document
						searchBody = searchBody + '{ "index" : "doclib3_'+ currentUser._id + '_privacy", "type":"Document", "pretty": "true" }\r\n' +
									 categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Separate indexes for users");
				}
				else if ( demomode === '4') // <option value="4">Separate types for private/public/share</option>
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib4_'+ currentUser._id + '", "type":"Document_public", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
						// my private document
						searchBody = searchBody + '{ "index" : "doclib4_'+ currentUser._id + '", "type": "Document_private", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}				
					console.log("Separate types for private/public/share");
				}
				else // <option value="1">Custom routing with 3 public/private/share indexes</option> or others option
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{"index" : "doclib_public", "type":"Document", "routing" :  "' + currentUser._id + '", "pretty": "true"}\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
						// my private document
						searchBody = searchBody + '{"index" : "doclib_private", "type":"Document", "routing" :  "' + currentUser._id + '", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with 3 public/private/share indexes");
				}
			}
			else if ( privacy === "public" ) // <option value="public">my Public</option>
			{
				console.log("my Public only");
				// base on the demomode generate the searchURL and searchBody for multi index
				if ( demomode === '2' ) // <option value="2">Custom routing with one index and 3 public/private/share types</option>									
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib2", "type":"Document_public", "routing" : "' + currentUser._id + '", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with one index and 3 public/private/share types");
				}
				else if ( demomode === '3' ) // <option value="3">Separate indexes for users</option>							
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib3_' + currentUser._id + '_public", "type":"Document", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Separate indexes for users");
				}
				else if ( demomode === '4') // <option value="4">Separate types for private/public/share</option>
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib4_'+ currentUser._id + '", "type":"Document_public", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}				
					console.log("Separate types for private/public/share");
				}
				else // <option value="1">Custom routing with 3 public/private/share indexes</option> or others option
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{"index" : "doclib_public", "type":"Document", "routing" :  "' + currentUser._id + '", "pretty": "true"}\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with 3 public/private/share indexes");
				}
			}
			else if ( privacy === "private") // <option value="private">my Private</option>
			{
				console.log("my Private only");
				// base on the demomode generate the searchURL and searchBody for multi index
				if ( demomode === '2' ) // <option value="2">Custom routing with one index and 3 public/private/share types</option>									
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib2", "type":"Document_private", "routing" : "' + currentUser._id + '", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with one index and 3 public/private/share types");
				}
				else if ( demomode === '3' ) // <option value="3">Separate indexes for users</option>							
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib3_' + currentUser._id + '_private", "type":"Document", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Separate indexes for users");
				}
				else if ( demomode === '4') // <option value="4">Separate types for private/public/share</option>
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{ "index" : "doclib4_'+ currentUser._id + '", "type":"Document_private", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}				
					console.log("Separate types for private/public/share");
				}
				else // <option value="1">Custom routing with 3 public/private/share indexes</option> or others option
				{
					if ( currentUser )
					{
						// my public document 
						searchBody = '{"index" : "doclib_private", "type":"Document", "routing" :  "' + currentUser._id + '", "pretty": "true"}\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with 3 public/private/share indexes");
				}			
			}
			else // <option value="all">All Public and my Private</option> and others
			{
				console.log("All Public and my Private");
				// base on the demomode generate the searchURL and searchBody for multi index
				if ( demomode === '2' ) // <option value="2">Custom routing with one index and 3 public/private/share types</option>									
				{
					// all public document 
					searchBody = '{ "index" : "doclib2", "type":"Document_public", "pretty": "true" }\r\n' +
								 categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					if ( currentUser )
					{
						// my private document
						searchBody = searchBody + '{ "index" : "doclib2", "type":"Document_private", "routing" : "' + currentUser._id + '", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with one index and 3 public/private/share types");
				}
				else if ( demomode === '3' ) // <option value="3">Separate indexes for users</option>							
				{
					// all public document 
					searchBody = '{ "index" : "doclib3_*_public", "type":"Document", "pretty": "true" }\r\n' +
								categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					if ( currentUser )
					{
						// my private document
						searchBody = searchBody + '{ "index" : "doclib3_'+ currentUser._id + '_privacy", "type":"Document", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Separate indexes for users");
				}
				else if ( demomode === '4') // <option value="4">Separate types for private/public/share</option>
				{
					// all public document 
					searchBody = '{ "index" : "doclib4_*", "type":"Document_public", "pretty": "true" }\r\n' +
								categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					if ( currentUser )
					{
						// my private document
						searchBody = searchBody + '{ "index" : "doclib4_'+ currentUser._id + '", "type": "Document_private", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}				
					console.log("Separate types for private/public/share");
				}
				else // <option value="1">Custom routing with 3 public/private/share indexes</option> or others option
				{
					// all public document 
					searchBody = '{"index" : "doclib_public", "type":"Document", "pretty": "true"}\r\n' +
								 categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					if ( currentUser )
					{
						// my private document
						searchBody = searchBody + '{"index" : "doclib_private", "type":"Document", "routing" :  "' + currentUser._id + '", "pretty": "true" }\r\n' +
									categoryFilter_prefix + categoryFilter + '{ "query" : {"simple_query_string" : {"query" : "' + query + '"}}' + categoryFilter_subfix + ', "from" : "' + fromPage + '", "size" : "' + size + '"}\r\n';
					}
					console.log("Custom routing with 3 public/private/share indexes");
				}
			}

			var config = {
					method: 'POST',
					url : searchURL,
					headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
					data: searchBody
				};
			console.log("=============SEARCH CONFIG=============");
			console.log(searchBody);
			console.log(config);
			console.log("=============SEARCH CONFIG=============");
			
			$http(config)
			.then(function(response) {
				//console.log("Send query successful");
				//console.log(response);
				if (typeof successCallback === "function")	
				{
					//console.log("Callback called");
					successCallback(response);
				}
			}, function (err) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				if (typeof errorCallback === "function")
				{
					//console.log("Callback called");
					errorCallback(err);
				}
					
			});
		},
		searchUser: function(query, fromPage, size, successCallback, errorCallback)
		{
			var searchURL = SEARCH_HOST.URL + '/doclib_main/User/' +  SEARCH_HOST.SINGLE_API + '?q=' + query + '&from=' + fromPage + '&size=' + size;
			var config = {
					method: 'GET',
					url : searchURL
				};
			console.log("=============SEARCH CONFIG=============");
			console.log(config);
			console.log("=============SEARCH CONFIG=============");
			$http(config)
			.then(function(response) {
				//console.log("Send query successful");
				//console.log(response);
				if (typeof successCallback === "function")	
				{
					//console.log("Callback called");
					successCallback(response);
				}
			}, function (err) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				if (typeof errorCallback === "function")
				{
					//console.log("Callback called");
					errorCallback(err);
				}
					
			});
		}
	};
}
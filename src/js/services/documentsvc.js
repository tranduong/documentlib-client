'use strict';
angular
    .module('SDLMSys')
    .factory('DocumentSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', DocumentSvc]);
	
function DocumentSvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		getMines: function(success, error) {
			$http.get(baseUrl + '/mydocs').success(success).error(error);
		},
		updateInfo: function(data, success, error) {
			$http.post(baseUrl + '/updatedocument', data).success(success).error(error);
		},
		removeDoc: function(data, success, error){
			$http.post(baseUrl + '/deletedocument', data).success(success).error(error);
		},
		getDocPath: function(relative_path) {
			return baseUrl + '/' + relative_path;
		},
		getMyDownloadedDocs: function(success, error) {
			$http.get(baseUrl + '/mydownloadeddocuments').success(success).error(error);
		},
		getMyLikedDocs: function(success, error) {
			$http.get(baseUrl + '/mylikeddocuments').success(success).error(error);
		},
		getMyReadingDocs: function(success, error) {
			$http.get(baseUrl + '/myreadingdocuments').success(success).error(error);
		},
		getMySharedDocs: function(success, error) {
			$http.get(baseUrl + '/myshareddocuments').success(success).error(error);
		},
		getUserReadingDocs: function(user_id, success, error) {
			$http.get(baseUrl + '/userReadingDocs?userid=' + user_id).success(success).error(error);
		},
		getSharedForMeDocuments: function(success, error) {
			$http.get(baseUrl + '/sharedForMeDocuments').success(success).error(error);
		}
	};
}
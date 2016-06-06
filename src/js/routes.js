'use strict';

/**
 * Route configuration for the SDLMSys module.
 */
angular.module('SDLMSys').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes	
		$urlRouterProvider.otherwise("/login");
        // Application routes
        $stateProvider
            .state('base',{     abstract: true,
                                url: "",
                                views: {
                                        "sidebar@": {},
                                        "content@": {									       templateUrl:"templates/base.html"
                                        },
                                        "headerbar@": {}
                                }
                    })
            .state('index', {
                                url: '/',
				parent:"base",
				views: {
					"content@": {
						controller: 'AuthCtrl',
						templateUrl: 'templates/login/login.html'						
					}
				}
                     })
            .state('login', {
                                url: '/login',
				parent:"base",
				views: {
					"content@": {
						controller: 'AuthCtrl',
						templateUrl: 'templates/login/login.html'
					}
				}
            })
            .state('logout', {
                url: '/logout',
				parent:"base",
				views: {
					"content@": {
						controller: 'AuthCtrl',
						templateUrl: 'templates/login/logout.html'
					}
				}
            })
            .state('register', {
                                url: '/register',
				parent:"base",
				views: {
					"content@": {
						controller: 'AuthCtrl',
						templateUrl: 'templates/register/registeruser.html'						
					}
				}
            })
            .state('registerfailed', {
                                url: '/registerfailed',
				parent:"base",
				views: {
					"content@": {
						templateUrl: 'templates/register/registerfailed.html'
					}
				}
            })
            .state('registersuccessful', {
                                url: '/registersuccessful',
				parent:"base",
				views: {
					"content@": {
						templateUrl: 'templates/register/registersuccessful.html'
					}
				}
            })			
            .state('controlpanel', {
                                url: '/controlpanel',
				parent:"base",
				views: {
					"sidebar@": {
						templateUrl: '/templates/partials/sidebar.html'
					},
					"content@": {
						templateUrl: '/templates/overall/controlpanel.html'
					},
					"headerbar@": {
						templateUrl: '/templates/partials/headerbar.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Home page'
				}
            })
            .state('searchdocument', {
                                url: '/searchdocument',
				parent:"controlpanel",
				views: {
					"content@": {						
						templateUrl: 'templates/search/searchdocument.html'				
					}
				},
				ncyBreadcrumb: {
					label: 'Search Documents'
				}                
            })			
            .state('suggestdocument', {
                                url: '/suggestdocument',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/suggest/suggestdocument.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Suggest Documents'
				} 
            })
            .state('downloaddocument', {
                                url: '/downloaddocument',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/download/downloaddocument.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Download Documents'
				} 
            })
            .state('readingdocumentlist', {
                                url: '/readingdocumentlist',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/list/readingdocumentlist.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Reading Documents'
				} 
            })
            .state('likeddocumentlist', {
                                url: '/likeddocumentlist',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/list/likeddocumentlist.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Liked Documents'
				} 
            })
            .state('shareddocumentlist', {
                                url: '/shareddocumentlist',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/list/shareddocumentlist.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Shared Documents'
				} 
            })
            .state('uploaddocument', {
                                url: '/uploaddocument',
				parent:"controlpanel",
				views: {
					"content@": {						
						templateUrl: 'templates/upload/uploaddocument.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Upload Document'
				} 			
            })
            .state('uploaddocumentlist', {
                                url: '/uploaddocumentlist',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/list/uploadeddocumentlist.html'
					}
				},
				ncyBreadcrumb: {
					label: 'Uploaded Documents'
				} 	
            })
            .state('userinteractionlist', {
                                url: '/userinteractionlist',
				parent:"controlpanel",
				views: {
					"content@": {
						templateUrl: 'templates/list/userinteractionlist.html'
					}
				},
				ncyBreadcrumb: {
					label: 'User Interaction'
				} 	
            });		
    }
]);

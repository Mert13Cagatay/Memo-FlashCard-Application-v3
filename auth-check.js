// auth-check.js - Add this script to all pages that require login
(function() {
    // Check if the current page is login or signup
    const currentPath = window.location.pathname;
    const authPages = ['/login.html', '/signup.html', '/index.html', '/'];
    
    // If we're already on an auth page, no need to check or redirect
    if (authPages.some(page => currentPath.endsWith(page))) {
        return;
    }

    // Wait for Firebase to initialize before checking auth state
    document.addEventListener('DOMContentLoaded', function() {
        // Check if Firebase is loaded
        if (typeof firebase !== 'undefined' && firebase.app) {
            // Wait for the Firebase Auth state to be ready
            firebase.auth().onAuthStateChanged(function(user) {
                if (!user) {
                    // User is not logged in, redirect to login page
                    window.location.href = 'login.html';
                    return;
                }
                
                // User is logged in, check their Firestore data
                firebase.firestore().collection('users').doc(user.uid).get()
                    .then(doc => {
                        if (doc.exists) {
                            const userData = doc.data();
                            
                            // Store user data in localStorage for quicker access
                            localStorage.setItem('memo-current-user', JSON.stringify({
                                id: userData.id,
                                email: userData.email,
                                name: userData.name || userData.username,
                                username: userData.username,
                                loggedIn: true
                            }));
                            
                            // If the page is account.html, my-decks.html, etc., load user specific data
                            if (typeof fetchUserDecks === 'function' && currentPath.endsWith('/my-decks.html')) {
                                fetchUserDecks(userData.id)
                                    .catch(error => console.error('Error fetching decks:', error));
                            }
                            
                            if (typeof fetchPracticeHistory === 'function' && currentPath.endsWith('/account.html')) {
                                fetchPracticeHistory(userData.id)
                                    .catch(error => console.error('Error fetching practice history:', error));
                            }
                        } else {
                            console.log('User document not found in Firestore');
                            // If user exists in Auth but not in Firestore, create a basic profile
                            firebase.firestore().collection('users').doc(user.uid).set({
                                id: user.uid,
                                email: user.email,
                                username: user.email.split('@')[0],
                                createdAt: new Date().toISOString()
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error getting user data:', error);
                    });
            });
        } else {
            // Fallback to localStorage check if Firebase isn't loaded yet
            const currentUser = JSON.parse(localStorage.getItem('memo-current-user')) || 
                               JSON.parse(sessionStorage.getItem('memo-current-user'));
            
            // If not logged in, redirect to login page
            if (!currentUser || !currentUser.loggedIn) {
                window.location.href = 'login.html';
            }
        }
    });
})();
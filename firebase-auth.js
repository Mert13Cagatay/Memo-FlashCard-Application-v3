// firebase-auth.js

// Kullanıcı kaydı
function registerUser(email, password, username) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Kullanıcı hesabı oluşturuldu
        const user = userCredential.user;
        
        // Kullanıcı profil bilgilerini Firestore'a kaydet
        return db.collection('users').doc(user.uid).set({
          id: user.uid,
          username: username,
          email: email,
          createdAt: new Date().toISOString()
        })
        .then(() => {
          // Kullanıcı bilgilerini localStorage'a da kaydet
          const userData = {
            id: user.uid,
            username: username,
            email: email
          };
          localStorage.setItem('memo-current-user', JSON.stringify(userData));
          return userData;
        });
      });
  }
  
  // Kullanıcı girişi
  function loginUser(email, password, rememberMe) {
    return auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Giriş başarılı
        const user = userCredential.user;
        
        // Kullanıcı bilgilerini Firestore'dan al
        return db.collection('users').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              
              // Kullanıcı bilgilerini localStorage veya sessionStorage'a kaydet
              if (rememberMe) {
                localStorage.setItem('memo-current-user', JSON.stringify(userData));
              } else {
                sessionStorage.setItem('memo-current-user', JSON.stringify(userData));
              }
              
              return userData;
            } else {
              // Kullanıcı Firebase Auth'da var ama Firestore'da yoksa
              const userData = {
                id: user.uid,
                email: user.email,
                username: user.email.split('@')[0] // Varsayılan kullanıcı adı olarak e-postanın ilk kısmını kullan
              };
              
              // Firestore'a kullanıcı bilgilerini kaydet
              return db.collection('users').doc(user.uid).set(userData)
                .then(() => {
                  if (rememberMe) {
                    localStorage.setItem('memo-current-user', JSON.stringify(userData));
                  } else {
                    sessionStorage.setItem('memo-current-user', JSON.stringify(userData));
                  }
                  return userData;
                });
            }
          });
      });
  }
  
  // Kullanıcı çıkışı
  function logoutUser() {
    return auth.signOut()
      .then(() => {
        // localStorage ve sessionStorage'dan kullanıcı bilgilerini temizle
        localStorage.removeItem('memo-current-user');
        sessionStorage.removeItem('memo-current-user');
      });
  }
  
  // Kullanıcı oturum durumunu kontrol et
  function checkAuthState() {
    return new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // Kullanıcı giriş yapmış
          db.collection('users').doc(user.uid).get()
            .then((doc) => {
              if (doc.exists) {
                resolve(doc.data());
              } else {
                resolve(null);
              }
            });
        } else {
          // Kullanıcı giriş yapmamış
          resolve(null);
        }
      });
    });
  }
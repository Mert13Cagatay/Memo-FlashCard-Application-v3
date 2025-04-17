// Bu kodu index.html dosyanıza </body> etiketinden önce ekleyin
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut kullanıcı bilgisini al
    const currentUser = JSON.parse(localStorage.getItem('memo-current-user')) || 
                         JSON.parse(sessionStorage.getItem('memo-current-user'));
    
    if (!currentUser) {
        return; // Kullanıcı yoksa hiçbir şey yapma (login sayfasına yönlendirilecek)
    }
    
    // Kullanıcının ID'sini al
    const userId = currentUser.id;
    
    // Bu kullanıcıya daha önce modal gösterilmiş mi kontrol et
    const modalShownUsers = JSON.parse(localStorage.getItem('memo-modal-shown-users')) || [];
    
    // Eğer bu kullanıcıya daha önce gösterilmediyse modalı göster
    if (!modalShownUsers.includes(userId)) {
        // Modal HTML içeriği
        const modalHTML = `
        <div id="welcome-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); z-index: 1000; align-items: center; justify-content: center;">
            <iframe id="welcome-modal-iframe" style="width: 90%; max-width: 700px; height: 80vh; border: none; border-radius: 15px;" src="welcome-modal.html"></iframe>
        </div>
        `;
        
        // Modal HTML'i body'nin sonuna ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Animasyonun bitmesini bekle ve modalı göster (4 saniye sonra)
        setTimeout(function() {
            const modalOverlay = document.getElementById('welcome-modal-overlay');
            modalOverlay.style.display = 'flex';
            
            // Kullanıcıyı gösterildi listesine ekle
            modalShownUsers.push(userId);
            localStorage.setItem('memo-modal-shown-users', JSON.stringify(modalShownUsers));
        }, 4000);
    }
    
    // iframe'den gelen mesajları dinle (modal kapatma için)
    window.addEventListener('message', function(event) {
        if (event.data === 'closeModal') {
            const modalOverlay = document.getElementById('welcome-modal-overlay');
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        }
    });
});
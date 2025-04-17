// firebase-decks.js

// Kullanıcının destelerini Firestore'dan getir
function fetchUserDecks(userId) {
  return db.collection('decks')
    .where('userId', '==', userId)
    .get()
    .then((querySnapshot) => {
      const decks = [];
      querySnapshot.forEach((doc) => {
        decks.push(doc.data());
      });

      // Desteleri localStorage'a da kaydet
      localStorage.setItem('memo-decks', JSON.stringify(decks));

      return decks;
    });
}

// Tüm varsayılan desteleri getir
function fetchDefaultDecks() {
  return db.collection('decks')
    .where('userId', '==', 'system-demo-decks')
    .get()
    .then((querySnapshot) => {
      const defaultDecks = [];
      querySnapshot.forEach((doc) => {
        defaultDecks.push(doc.data());
      });

      return defaultDecks;
    });
}

// Desteyi Firestore'a kaydet
function saveDeck(deck) {
  return db.collection('decks').doc(deck.id).set(deck)
    .then(() => {
      updateLocalDecks(deck);
      return deck;
    });
}

// Desteyi Firestore'dan sil
function deleteDeck(deckId) {
  return db.collection('decks').doc(deckId).delete()
    .then(() => {
      const decks = JSON.parse(localStorage.getItem('memo-decks')) || [];
      const updatedDecks = decks.filter(deck => deck.id !== deckId);
      localStorage.setItem('memo-decks', JSON.stringify(updatedDecks));

      return deckId;
    });
}

// Pratik geçmişini kaydet
function savePracticeHistory(userId, practiceSession) {
  practiceSession.userId = userId;

  return db.collection('practice-history')
    .doc(practiceSession.id)
    .set(practiceSession)
    .then(() => {
      const practiceHistory = JSON.parse(localStorage.getItem(`memo-practice-history-${userId}`)) || [];
      practiceHistory.push(practiceSession);
      localStorage.setItem(`memo-practice-history-${userId}`, JSON.stringify(practiceHistory));

      return practiceSession;
    });
}

// Pratik geçmişini getir
function fetchPracticeHistory(userId) {
  return db.collection('practice-history')
    .where('userId', '==', userId)
    .get()
    .then((querySnapshot) => {
      const practiceHistory = [];
      querySnapshot.forEach((doc) => {
        practiceHistory.push(doc.data());
      });

      localStorage.setItem(`memo-practice-history-${userId}`, JSON.stringify(practiceHistory));

      return practiceHistory;
    });
}

// Yerel desteyi güncelle
function updateLocalDecks(updatedDeck) {
  const decks = JSON.parse(localStorage.getItem('memo-decks')) || [];
  const existingIndex = decks.findIndex(deck => deck.id === updatedDeck.id);

  if (existingIndex >= 0) {
    decks[existingIndex] = updatedDeck;
  } else {
    decks.push(updatedDeck);
  }

  localStorage.setItem('memo-decks', JSON.stringify(decks));
}

// Tüm varsayılan desteleri yeni kullanıcıya ekle
function addDefaultDecksToNewUser(userId) {
  if (!window.defaultDecks || !Array.isArray(window.defaultDecks)) {
    console.error("Default decks not found in global scope.");
    return Promise.resolve();
  }

  const decksToSave = window.defaultDecks.map(deck => {
    const cardsWithIds = deck.cards.map(card => ({
      id: 'card-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      front: card.front,
      back: card.back,
      createdAt: new Date().toISOString()
    }));

    return {
      id: 'deck-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      userId: userId,
      name: deck.name,
      description: deck.description,
      createdAt: new Date().toISOString(),
      cards: cardsWithIds
    };
  });

  return Promise.all(decksToSave.map(saveDeck));
}

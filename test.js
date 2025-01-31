document.addEventListener('DOMContentLoaded', function () {
    let furnitureData = [];
    let filteredData = [];
    let currentPage = 1;
    const itemsPerPage = 9;  // Updated to 9 items per page
  
    console.log('Starting script...');
  
    // Fetch JSON data
    fetch('furniture.json')
      .then(response => response.json())
      .then(data => {
        console.log('JSON loaded successfully:', data);
        furnitureData = data;
        initPage();
      })
      .catch(error => console.error('Error fetching JSON:', error));
  
    /* ========================== */
    /*      Initialize Pages      */
    /* ========================== */
    function initPage() {
      if (document.getElementById('search-bar')) {
        setupSearchPage();
      } else if (document.getElementById('match-container')) {
        setupMatchPage();
      } else if (document.getElementById('room-container')) {
        setupRoomPage();
      }
    }
  
    /* ========================== */
    /*      Search Page Logic     */
    /* ========================== */
    function setupSearchPage() {
      document.getElementById('search-button').addEventListener('click', function () {
        const query = document.getElementById('search-bar').value.toLowerCase().trim();
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const selectedStyle = document.getElementById('style-filter').value.toLowerCase();
  
        // Filter by search query, price range, and style
        filteredData = furnitureData.filter(item => {
          const matchesQuery = query ? item.furniture_type && item.furniture_type.toLowerCase().includes(query) : true;
          const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
          const matchesStyle = selectedStyle ? item.style && item.style.toLowerCase() === selectedStyle : true;
  
          return matchesQuery && matchesPrice && matchesStyle;
        });
  
        currentPage = 1;
        displayPage();
      });
  
      filteredData = furnitureData;
      displayPage();
    }
  
    function displayPage() {
      const resultsDiv = document.getElementById('results');
      const paginationDiv = document.getElementById('pagination-controls');
  
      resultsDiv.innerHTML = '';
      paginationDiv.innerHTML = '';
  
      if (filteredData.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
      }
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  
      for (let i = startIndex; i < endIndex; i++) {
        const item = filteredData[i];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'grid-item';
        itemDiv.innerHTML = `
          <div class="product-card">
            <img src="images/${item.Image_path}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p><strong>Material:</strong> ${item.material}</p>
            <p><strong>Dimensions:</strong> ${item.l || 'N/A'} x ${item.w || 'N/A'} x ${item.h || 'N/A'} cm</p>
            <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
            <p><strong>Brand:</strong> ${item.brand}</p>
            <p><strong>Style:</strong> ${item.style || 'N/A'}</p>
          </div>
        `;
        resultsDiv.appendChild(itemDiv);
      }
  
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.className = (page === currentPage) ? 'active' : '';
        pageButton.addEventListener('click', () => {
          currentPage = page;
          displayPage();
        });
        paginationDiv.appendChild(pageButton);
      }
    }
  
    /* ========================== */
    /*      Match Furniture Logic     */
    /* ========================== */
    function setupMatchPage() {
      generateMatch();
  
      document.getElementById('like-button').addEventListener('click', function () {
        handleMatchChoice('like');
      });
  
      document.getElementById('dislike-button').addEventListener('click', function () {
        handleMatchChoice('dislike');
      });
    }
  
    function generateMatch() {
      const matchContainerLeft = document.getElementById('item-left');
      const matchContainerRight = document.getElementById('item-right');
  
      if (furnitureData.length < 2) {
        document.getElementById('match-container').innerHTML = '<p>Not enough data to match.</p>';
        return;
      }
  
      const item1 = furnitureData[Math.floor(Math.random() * furnitureData.length)];
      let item2;
      do {
        item2 = furnitureData[Math.floor(Math.random() * furnitureData.length)];
      } while (item1 === item2);
  
      displayMatchItem(matchContainerLeft, item1);
      displayMatchItem(matchContainerRight, item2);
  
      matchContainerLeft.setAttribute('data-item-id', item1.id);
      matchContainerLeft.setAttribute('data-category', item1.furniture_type.toLowerCase());
      matchContainerRight.setAttribute('data-item-id', item2.id);
      matchContainerRight.setAttribute('data-category', item2.furniture_type.toLowerCase());
    }
  
    function displayMatchItem(container, item) {
      container.innerHTML = `
        <div class="product-card">
          <img src="images/${item.Image_path}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p><strong>Material:</strong> ${item.material}</p>
          <p><strong>Dimensions:</strong> ${item.l || 'N/A'} x ${item.w || 'N/A'} x ${item.h || 'N/A'} cm</p>
          <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
          <p><strong>Brand:</strong> ${item.brand}</p>
          <p><strong>Style:</strong> ${item.style || 'N/A'}</p>
        </div>
      `;
    }
  
    function handleMatchChoice(choice) {
      console.log(`User chose to ${choice} the current match.`);
  
      document.querySelectorAll('#item-left, #item-right').forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-category');
        saveFeedback(category, itemId, choice);
      });
  
      generateMatch();
    }
  
    /* ========================== */
    /*    Room Suggestions Logic  */
    /* ========================== */
    function setupRoomPage() {
      generateRoom();
  
      document.getElementById('room-like-button').addEventListener('click', function () {
        handleRoomChoice('like');
      });
  
      document.getElementById('room-dislike-button').addEventListener('click', function () {
        handleRoomChoice('dislike');
      });
    }
  
    function generateRoom() {
      const roomContainer = document.getElementById('room-container');
      roomContainer.innerHTML = '';
  
      const categories = {
        sofa: 'sofa',
        loungeChair: 'lounge chair',
        floorLamp: 'floor lamp',
        coffeeTable: 'coffee table'
      };
  
      for (const [key, category] of Object.entries(categories)) {
        const items = furnitureData.filter(item => item.furniture_type && item.furniture_type.toLowerCase() === category);
        if (items.length > 0) {
          const randomItem = items[Math.floor(Math.random() * items.length)];
          displayRoomItem(randomItem, roomContainer);
        }
      }
    }
  
    function displayRoomItem(item, container) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'room-item';
      itemDiv.setAttribute('data-item-id', item.id);
      itemDiv.setAttribute('data-category', item.furniture_type.toLowerCase());
  
      itemDiv.innerHTML = `
        <div class="product-card">
          <img src="images/${item.Image_path}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p><strong>Material:</strong> ${item.material}</p>
          <p><strong>Dimensions:</strong> ${item.l || 'N/A'} x ${item.w || 'N/A'} x ${item.h || 'N/A'} cm</p>
          <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
          <p><strong>Brand:</strong> ${item.brand}</p>
          <p><strong>Style:</strong> ${item.style || 'N/A'}</p>
        </div>
      `;
      container.appendChild(itemDiv);
    }
  
    function handleRoomChoice(choice) {
      document.querySelectorAll('.room-item').forEach(item => {
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-category');
        saveFeedback(category, itemId, choice);
      });
  
      generateRoom();
    }
  
    function saveFeedback(category, itemId, feedback) {
      const data = JSON.parse(localStorage.getItem('furnitureFeedback')) || {};
  
      if (!data[category]) {
        data[category] = { likes: [], dislikes: [] };
      }
  
      if (feedback === 'like' && !data[category].likes.includes(itemId)) {
        data[category].likes.push(itemId);
      } else if (feedback === 'dislike' && !data[category].dislikes.includes(itemId)) {
        data[category].dislikes.push(itemId);
      }
  
      localStorage.setItem('furnitureFeedback', JSON.stringify(data));
      console.log('Feedback saved:', data);
    }
  });
  
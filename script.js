// Basic script to test output
fetch('furniture.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('JSON loaded successfully:', data);  // Debugging output
    document.getElementById('results').innerHTML = `<p>JSON successfully loaded. Found ${data.length} items.</p>`;
  })
  .catch(error => {
    console.error('Error fetching the JSON:', error);
    document.getElementById('results').innerHTML = `<p>Error loading JSON: ${error.message}</p>`;
  });

    // Get references to DOM elements
const inpfind = document.getElementById('searchBar');  // The search input field
const searchbtn = document.getElementById('searchButton');  // The search button
const resultsContainer = document.querySelector('.results');  // The container for displaying search results

// Function to perform the recipe search
function searchrecipe() {
    const searchterm = inpfind.value.trim();  // Get and trim the search input value

    if (searchterm) {  // Check if the search term is not empty
        // Save the search term to localStorage
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];  // Retrieve search history or initialize as empty array
        if (!history.includes(searchterm)) {  // If the search term is not already in history
            history.push(searchterm);  // Add the new search term to history
            localStorage.setItem('searchHistory', JSON.stringify(history));  // Save updated history to localStorage
        }

        // Construct the API URL for fetching recipes
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchterm)}`;

        // Fetch recipe data from API
        fetch(apiUrl)
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                resultsContainer.innerHTML = '';  // Clear any previous results

                if (data.meals && data.meals.length > 0) {  // Check if there are any meals in the response
                    // Create recipe cards for each meal
                    data.meals.forEach(meal => {
                        const card = document.createElement('div');  // Create a new card element
                        card.classList.add('recipe-card');  // Add the 'recipe-card' class
                        card.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">  <!-- Recipe image -->
                            <div class="content">
                                <h3>${meal.strMeal}</h3>  <!-- Recipe title -->
                                <p>${meal.strInstructions || 'No description available'}</p>  <!-- Recipe description -->
                            </div>
                        `;
                        resultsContainer.appendChild(card);  // Append the card to results container
                    });
                } else {
                    resultsContainer.innerHTML = '<p>No recipes found.</p>';  // Display a message if no recipes are found
                }
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);  // Log any errors
                resultsContainer.innerHTML = '<p>Sorry, there was an error fetching recipes.</p>';  // Display an error message
            });

        inpfind.value = '';  // Clear the input field after search
    }
}

// Function to display the search history dropdown
function showHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];  // Retrieve search history
    const dropdown = document.createElement('ul');  // Create a new dropdown element
    dropdown.classList.add('history-dropdown');  // Add the 'history-dropdown' class

    // Create list items for each search term
    history.forEach(term => {
        const item = document.createElement('li');  // Create a new list item
        item.textContent = term;  // Set the text content to the search term
        item.addEventListener('click', () => {  // Add click event listener to item
            inpfind.value = term;  // Set the input field value to the clicked term
            searchrecipe();  // Perform the search
        });
        dropdown.appendChild(item);  // Append the item to the dropdown
    });

    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.history-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();  // Remove the existing dropdown from the DOM
    }

    inpfind.parentElement.appendChild(dropdown);  // Append the new dropdown to the search section
}

// Function to hide the search history dropdown
function hideHistory() {
    const dropdown = document.querySelector('.history-dropdown');  // Get the dropdown element
    if (dropdown) {
        dropdown.remove();  // Remove the dropdown from the DOM
    }
}

// Event listener for search button click
searchbtn.addEventListener('click', searchrecipe);

// Event listener for 'Enter' key press in search input
inpfind.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchrecipe();  // Perform the search when 'Enter' is pressed
    }
});

// Event listeners for focus and blur events on search input
inpfind.addEventListener('focus', showHistory);  // Show the history dropdown when the input is focused
inpfind.addEventListener('blur', hideHistory);  // Hide the history dropdown when the input loses focus


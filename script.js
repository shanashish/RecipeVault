const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-closeBtn");

// Function to get recipes from API
const fetchRecipes = async (query = '') => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const apiUrl = query
            ? `https://ayur-analytics-6mthurpbxq-el.a.run.app/get/${query}`
            : `https://ayur-analytics-6mthurpbxq-el.a.run.app/get/all`;

        const data = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`);
        const response = await data.json();
        return response;
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
        console.error(error);
    }
};

// Function to fetch ingredients and details
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Function to open recipe popup
const openRecipePopUp = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Function to CLOSE recipe popup
recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Add EventListener on searchBtn
searchBtn.addEventListener("click", async(e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the name of the meal in the Search Box</h2>`;
        return;
    }
    const meal=await fetchRecipes(searchInput);
    recipeDetailsContent.innerHTML=""
    recipeContainer.innerHTML = "";
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
            <img src=${meal.foodImage} />
             <h3>${meal.foodName}</h3>
                <p><span>${meal.foodDescription}</span></p>
                 <p>Belongs eaten with<span>${meal.eatenWith}</span></p>
                `;
            const button = document.createElement("button");
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding EventListener to recipeButton
            button.addEventListener("click", () => {
                displayDetails(meal.foodName);
            });

            recipeContainer.appendChild(recipeDiv);
        });


// Fetch all recipes on page load
window.addEventListener("load",async () => {
    const data=await fetchRecipes(); // Fetch all recipes if no query is provided
    recipeContainer.innerHTML = "";
    data.recipesList.forEach((meal,index) => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <span>${meal}</span></>
                `;
                // <h3>${meal.strMeal}</h3>
                // <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            const button = document.createElement("button");
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding EventListener to recipeButton
            button.addEventListener("click", () => {
                displayDetails(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
});



//to display food details

const displayDetails = async (meal) => {
    const data = await fetchRecipes(meal);
    
    // Fetching the necessary data
    const { foodName, foodDescription, foodImage, eatenWith, keyIngredients } = data;
    console.log(keyIngredients);
    // Structuring the content with detailed styling
    recipeContainer.innerHTML=''
    recipeDetailsContent.innerHTML = `
        <div class="recipe-container">
            <h1 class="recipe-title">${foodName}</h1>
            <img src="${foodImage}" alt="${foodName}" class="recipe-image">
            <p class="recipe-description">${foodDescription}</p>
            <div class="second-container">
            <p class=""><strong>Eaten With:</strong> ${eatenWith}</p>
        <h1>Key ingrediets</h1>
        <div class="key-ingredients-list" >
            ${keyIngredients.map(ingredient => `
            <div class="ing-container">
            <img src=${ingredient[0]} class="ing-image" style=""/>
            <h6>${ingredient[1]}</h6>
            </div>
            `)}
        </div>
        </div>
          
           
        </div>
    `;
}

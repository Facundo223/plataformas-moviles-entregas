document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const recipeGrid = document.getElementById('recipe-grid');
    const loadingSpinner = document.getElementById('loading-spinner');

    async function fetchRecipes(category) {
        loadingSpinner.classList.remove('hidden');
        recipeGrid.innerHTML = '';

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${category}`);
            const data = await response.json();
            const meals = data.meals;

            meals.forEach(meal => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                card.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="showDetails('${meal.idMeal}')">Mostrar detalles</button>
                `;
                recipeGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    }

    async function showDetails(idMeal) {
        loadingSpinner.classList.remove('hidden');

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
            const data = await response.json();
            const meal = data.meals[0];

            const details = `
                <div class="recipe-details">
                    <h4>${meal.strMeal}</h4>
                    <p>${meal.strInstructions}</p>
                    <h5>Ingredientes:</h5>
                    <ul>
                        ${[...Array(20).keys()].map(i => 
                            meal[`strIngredient${i + 1}`] ? `<li>${meal[`strIngredient${i + 1}`]} - ${meal[`strMeasure${i + 1}`]}</li>` : ''
                        ).join('')}
                    </ul>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
            `;

            const detailsContainer = document.createElement('div');
            detailsContainer.innerHTML = details;
            detailsContainer.className = 'recipe-details-container';
            document.body.appendChild(detailsContainer);

        } catch (error) {
            console.error('Error fetching recipe details:', error);
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    }

    categorySelect.addEventListener('change', (e) => {
        const category = e.target.value;
        fetchRecipes(category);
    });

    // Load default category
    fetchRecipes(categorySelect.value);
});

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const recipeGrid = document.getElementById('recipe-grid');
    const loadingSpinner = document.getElementById('loading-spinner');

    async function fetchRecipes(category) {
        loadingSpinner.classList.remove('d-none');
        recipeGrid.innerHTML = '';

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${category}`);
            const data = await response.json();
            const meals = data.meals;

            meals.forEach(meal => {
                const card = document.createElement('div');
                card.className = 'recipe-card card';
                card.innerHTML = `
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <button class="btn btn-primary" onclick="showDetails('${meal.idMeal}')">Mostrar detalles</button>
                    </div>
                `;
                recipeGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }

    async function showDetails(idMeal) {
        loadingSpinner.classList.remove('d-none');

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
            const data = await response.json();
            const meal = data.meals[0];

            const details = `
                <div class="modal fade" id="recipeDetailsModal" tabindex="-1" role="dialog" aria-labelledby="recipeDetailsModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="recipeDetailsModalLabel">${meal.strMeal}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>${meal.strInstructions}</p>
                                <h6>Ingredientes:</h6>
                                <ul>
                                    ${[...Array(20).keys()].map(i => 
                                        meal[`strIngredient${i + 1}`] ? `<li>${meal[`strIngredient${i + 1}`]} - ${meal[`strMeasure${i + 1}`]}</li>` : ''
                                    ).join('')}
                                </ul>
                                <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = details;
            document.body.appendChild(modalContainer);

            $('#recipeDetailsModal').modal('show');

        } catch (error) {
            console.error('Error fetching recipe details:', error);
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }

    categorySelect.addEventListener('change', (e) => {
        const category = e.target.value;
        fetchRecipes(category);
    });

    // Load default category
    fetchRecipes(categorySelect.value);
});

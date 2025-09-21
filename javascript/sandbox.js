const searchInput = document.getElementById("searchInput");
const checkboxes = document.querySelectorAll(".filters input[type='checkbox']");
const sortSelect = document.getElementById("sortSelect");
const productsContainer = document.querySelector(".products");
const products = Array.from(document.querySelectorAll(".product"));

function updateProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    const sortOrder = sortSelect.value;

    let filtered = products.filter(product => {
        const name = product.textContent.toLowerCase();
        const category = product.getAttribute("data-category");

        const matchesSearch = name.includes(searchText);
        const matchesCategory = selectedCategories.length ? selectedCategories.includes(category) : true;

        return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute("data-price"));
        const priceB = parseFloat(b.getAttribute("data-price"));
        return sortOrder === "menor" ? priceA - priceB : priceB - priceA;
    });

    productsContainer.innerHTML = "";
    filtered.forEach(product => productsContainer.appendChild(product));
}

searchInput.addEventListener("input", updateProducts);
checkboxes.forEach(cb => cb.addEventListener("change", updateProducts));
sortSelect.addEventListener("change", updateProducts);

updateProducts();

/**
* @jest-environment jsdom
*/

const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "../src/html/index.html");
const html = fs.readFileSync(htmlPath, "utf8");

let searchInput, checkboxes, sortSelect, productsContainer, products;

beforeEach(() => {
    document.documentElement.innerHTML = html;

    searchInput = document.getElementById("searchInput");
    checkboxes = document.querySelectorAll(".filters input[type='checkbox']");
    sortSelect = document.getElementById("sortSelect");
    productsContainer = document.querySelector(".products");
    products = Array.from(document.querySelectorAll(".product"));

    global.updateProducts = function() {
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
    };
});
    


test("Filtra produtos pelo texto de busca", () => {
    searchInput.value = "camisa branca";
    updateProducts();
    expect(productsContainer.children.length).toBe(1);
    expect(productsContainer.children[0].querySelector("h3").textContent).toBe("Camisa Branca");
});

test("Filtra produtos por categoria", () => {
    checkboxes.forEach(cb => cb.checked = cb.value === "vestido");
    updateProducts();
    expect(Array.from(productsContainer.children).every(p => p.getAttribute("data-category") === "vestido")).toBe(true);
});

test("Ordena produtos pelo preço do menor para o maior", () => {
    sortSelect.value = "menor";
    updateProducts();
    const prices = Array.from(productsContainer.children).map(p => parseFloat(p.getAttribute("data-price")));
    const sorted = [...prices].sort((a,b) => a-b);
    expect(prices).toEqual(sorted);
});

test("Ordena produtos do maior para o menor preço", () => {
    sortSelect.value = "maior";
    updateProducts();
    const prices = Array.from(productsContainer.children).map(p => parseFloat(p.getAttribute("data-price")));
    const sorted = [...prices].sort((a,b) => b-a);
    expect(prices).toEqual(sorted);
});

test("Filtra por categoria e busca simultaneamente", () => {
    searchInput.value = "vestido vermelho";
    checkboxes.forEach(cb => cb.checked = cb.value === "vestido");
    updateProducts();
    expect(productsContainer.children.length).toBe(1);
    expect(productsContainer.children[0].querySelector("h3").textContent).toBe("Vestido Vermelho");
});
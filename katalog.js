import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDaVI2Kc0Yxw_Mn29oAYelZPpZdwSUBEEQ",
    authDomain: "web-airsoft.firebaseapp.com",
    databaseURL: "https://web-airsoft-default-rtdb.firebaseio.com",
    projectId: "web-airsoft",
    storageBucket: "web-airsoft.firebasestorage.app",
    messagingSenderId: "1010018691124",
    appId: "1:1010018691124:web:87d3d7a92b81db3fcb8261",
    measurementId: "G-J0R054DEV3"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Получаем контейнер для каталога
const catalogContainer = document.getElementById('catalog');

// Функция для создания карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = "product";

    const name = product.Name || 'Без названия';
    const price = product.Price ? `${product.Price} ₽` : 'Цена не указана';
    const imageUrl = product.ImageURL && product.ImageURL.startsWith('http')
    ? product.ImageURL
    : '';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}">
        <h2>${name}</h2>
        <p class="price">${price}</p>
        <a href="#" class="buy-btn">Купить</a>
    `;

    catalogContainer.appendChild(card);
}

// Функция для загрузки товаров
async function loadProducts() {
    try {
        const snapshot = await get(ref(db, 'Prouducts'));
        const productsArray = snapshot.val();

        if (productsArray) {
            catalogContainer.innerHTML = ''; // Очищаем каталог

            productsArray.forEach(product => {
                if (product) { // Проверяем чтобы объект не был null
                    createProductCard(product);
                }
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Загружаем товары
loadProducts();

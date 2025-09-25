import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update, remove, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDaVI2Kc0Yxw_Mn29oAYelZPpZdwSUBEEQ",
  authDomain: "web-airsoft.firebaseapp.com",
  databaseURL: "https://web-airsoft-default-rtdb.firebaseio.com",
  projectId: "web-airsoft",
  storageBucket: "web-airsoft.appspot.com",
  messagingSenderId: "1010018691124",
  appId: "1:1010018691124:web:87d3d7a92b81db3fcb8261",
  measurementId: "G-J0R054DEV3"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ссылка на таблицу товаров
const productsTable = document.getElementById("productsTable");

// Функция для отображения товаров
function displayProducts(data) {
  productsTable.innerHTML = "";

  data.forEach((product, index) => {
    if (product) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4">${index}</td>
        <td class="px-6 py-4">${product.Name}</td>
        <td class="px-6 py-4">${product.Description || "-"}</td>
        <td class="px-6 py-4">${product.Price} ₽</td>
        <td class="px-6 py-4 space-x-2">
          <button class="text-blue-600 hover:underline" onclick="editProduct(${index})">Редактировать</button>
          <button class="text-red-600 hover:underline" onclick="deleteProduct(${index})">Удалить</button>
        </td>
      `;
      productsTable.appendChild(row);
    }
  });
}

// Загрузка товаров из Firebase
const productsRef = ref(db, "Prouducts");
onValue(productsRef, (snapshot) => {
  const data = snapshot.val() || [];
  displayProducts(data);
});

// Добавление нового товара
const addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const imageURL = document.getElementById("productImageURL").value.trim();

  if (!name || !price || !imageURL) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }

  try {
    const snapshot = await get(productsRef);
    const data = snapshot.val() || [];
    const products = Array.isArray(data) ? data : Object.values(data);

    const newId = products.length;
    const newProduct = {
      ID_Prouduct: newId,
      Name: name,
      Description: description,
      Price: price,
      ImageURL: imageURL
    };

    // Сохраняем с использованием ID как ключа
    await update(productsRef, { [newId]: newProduct });

    addProductForm.reset();
    alert("Товар успешно добавлен!");
  } catch (error) {
    console.error("Ошибка при добавлении товара:", error);
    alert("Произошла ошибка при добавлении товара.");
  }
});

// Удаление товара
window.deleteProduct = async function (id) {
  try {
    const productRef = ref(db, `Prouducts/${id}`);
    await set(productRef, null);
    alert("Товар успешно удалён!");
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    alert("Произошла ошибка при удалении товара.");
  }
  
};
// Открыть модал и заполнить форму редактирования
window.editProduct = async function (id) {
  const snapshot = await get(productsRef);
  const data = snapshot.val();
  const product = data[id];

  if (!product) {
    alert("Товар не найден.");
    return;
  }

  // Заполняем форму
  document.getElementById("editProductId").value = id;
  document.getElementById("editProductName").value = product.Name;
  document.getElementById("editProductDescription").value = product.Description;
  document.getElementById("editProductPrice").value = product.Price;
  document.getElementById("editProductImageURL").value = product.ImageURL;

  // Открываем модал
  const modal = new Modal(document.getElementById("editProductModal"));
  modal.show();
};

// Обработка сохранения изменений
const editProductForm = document.getElementById("editProductForm");
editProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("editProductName").value.trim();
  const description = document.getElementById("editProductDescription").value.trim();
  const price = document.getElementById("editProductPrice").value.trim();
  const imageURL = document.getElementById("editProductImageURL").value.trim();

  if (!name || !price || !imageURL) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }

  const updatedProduct = {
    ID_Prouduct: Number(id),
    Name: name,
    Description: description,
    Price: price,
    ImageURL: imageURL
  };

  try {
    await update(productsRef, { [id]: updatedProduct });

    // Закрыть модал
    const modalEl = document.getElementById("editProductModal");
    const modal = new Modal(modalEl); // создаём заново
    modal.hide();

    alert("Товар успешно обновлён!");
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    alert("Произошла ошибка при обновлении товара.");
  }
});

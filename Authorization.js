// Подключение необходимых модулей Firebase через CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);  

// Функция для входа пользователя
async function loginUser() {
    // Получение email и пароля из формы
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Простая валидация формы
    if (!email || !password) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите логин и пароль!",
          });
        return;
    }

    try {
        // Получение данных из коллекции "Authorization"
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val();

        // Фильтрация потенциальных пустых элементов
        const filteredUsers = Object.values(users).filter(u => u);

        // Поиск пользователя с соответствующим email и паролем (без учета регистра)
        const user = filteredUsers.find(u => u.Login.toLowerCase() === email.toLowerCase() && u.Password === password);

        if (user) {
            
            // Проверка, является ли пользователь администратором
            const isAdmin = user.Post === 1;
            // Проверка, является ли пользователь тренером
            const isCoach = user.Post === 3;

            if (isAdmin) {
                // Перенаправление на страницу администратора
                window.location.href = 'Admin.html';
            } else if (isCoach) {
                // Перенаправление на страницу тренера
                window.location.href = 'index.html';
            } else {
                // Перенаправление на страницу спортсмена
                window.location.href = 'index.html';
            }
        } else {
            // Пользователь не найден или неверный email/пароль
            console.error('Пользователь не найден или неверный логин/пароль.');
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Неправильный логин или пароль!",
              });
        }
    } catch (error) {
        // Обработка ошибок при получении данных пользователя
        console.error('Ошибка при получении данных пользователя:', error);
    }
}

// Добавление слушателя события click к кнопке входа
document.getElementById('signIn').addEventListener('click', loginUser);
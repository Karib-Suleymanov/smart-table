import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Подключение компонентов и инициализация приложения

// Исходные данные, используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка данных из формы таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage); // Преобразуем количество строк в число
    const page = parseInt(state.page ?? 1); // Номер текущей страницы (по умолчанию 1)

    // Возвращаем расширенное состояние таблицы
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка таблицы при изменениях и действиях пользователя
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // Текущее состояние формы
    let result = [...data]; // Копируем исходные данные для дальнейшей обработки

    // Применяем поиск, фильтрацию, сортировку и пагинацию
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    // Отрисовываем таблицу
    sampleTable.render(result);
}

// Инициализация таблицы и подключение шаблонов
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация поиска
const applySearching = initSearching('search');

// Инициализация фильтрации
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers // Для элемента с именем searchBySeller передаём массив продавцов
});

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Добавляем таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Первичный рендер таблицы
render();

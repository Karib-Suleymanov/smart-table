import './fonts/ys-display/fonts.css'
import './style.css'

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

// Подключение компонентов для работы таблицы:
// пагинации, сортировки, фильтрации и поиска
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Инициализация API для работы с сервером.
// Объект `api` предоставляет методы getRecords() и getIndexes().
const api = initData();


//   Сбор и обработка данных из формы таблицы
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    // Возвращаем расширенное состояние таблицы
    return {
        ...state,
        rowsPerPage,
        page
    };
}

//   Перерисовка таблицы при изменениях и действиях пользователя
async function render(action) {
    let state = collectState(); // Текущее состояние формы таблицы
    let query = {}; // Параметры запроса, отправляемые на сервер

    // Применяем поиск, фильтрацию, сортировку и пагинацию.
    // Каждая функция обновляет объект `query`, который используется в запросе к API.
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получаем данные с сервера согласно сформированным параметрам
    const { total, items } = await api.getRecords(query);

    // Обновляем пагинацию в соответствии с общим количеством записей и текущей страницей
    updatePagination(total, query);

    // Отрисовываем таблицу с новыми данными
    sampleTable.render(items);
}

// Инициализация таблицы и подключение шаблонов разметки:
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация пагинации:
// возвращает две функции — applyPagination (для формирования query) и updatePagination (для обновления интерфейса)
const { applyPagination, updatePagination } = initPagination(
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

// Инициализация сортировки:
// передаём элементы, отвечающие за сортировку по дате и по сумме
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация фильтрации:
// возвращает функции applyFiltering (применить фильтры) и updateIndexes (обновить списки доступных значений)
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

// Инициализация поиска по таблице
const applySearching = initSearching('search');

// Добавляем таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

/**
 * Инициализация приложения:
 * - Получаем индексы (списки значений для фильтров) с сервера
 * - Обновляем фильтры
 * - Назначаем обработчики кнопок очистки фильтров
 */
async function init() {
    // Получаем вспомогательные данные с сервера, например список продавцов
    const indexes = await api.getIndexes();

    // Обновляем фильтры, подставляя полученные значения
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });

    // Обработка кнопок очистки фильтров:
    // сбрасывает значение фильтра и вызывает повторный рендер таблицы
    const filterRow = sampleTable.filter.container;
    const clearButtons = filterRow.querySelectorAll('button[name="clear"]');

    clearButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const parent = btn.closest('label');
            const input = parent?.querySelector('input, select');
            if (input) input.value = '';

            render({ name: 'clear', dataset: { field: btn.dataset.field } });
        });
    });
}

// Запуск инициализации приложения и первичного рендера таблицы
init().then(render);

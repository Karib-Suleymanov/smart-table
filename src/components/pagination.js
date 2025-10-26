import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {

    //  Подготавливаем шаблон кнопки страницы и очищаем контейнер
  
    const pageTemplate = pages.firstElementChild.cloneNode(true); // Берём первый элемент как шаблон для кнопок страниц
    pages.firstElementChild.remove(); // Удаляем исходный элемент, чтобы очистить контейнер

    let pageCount; // Храним общее количество страниц

    //   Формирует query-параметры пагинации и обрабатывает действия пользователя
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage; // Количество строк на странице
        let page = state.page; // Текущая страница

        // Обрабатываем нажатия на кнопки пагинации
        if (action) switch (action.name) {
            case 'prev': page = Math.max(1, page - 1); break;      // Предыдущая страница
            case 'next': page = Math.min(pageCount, page + 1); break; // Следующая страница
            case 'first': page = 1; break;                         // Первая страница
            case 'last': page = pageCount; break;                  // Последняя страница
        }

        // Возвращаем обновлённые параметры для запроса
        return Object.assign({}, query, { limit, page });
    };

    
    //  Обновляет отображение пагинации и информацию о диапазоне видимых строк
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit); // Вычисляем количество страниц

        // Получаем список видимых страниц (например, максимум 5 кнопок)
        const visiblePages = getPages(page, pageCount, 5);

        // Перерисовываем элементы пагинации
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // Обновляем информацию о диапазоне строк (от, до, всего)
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);

        fromRow.textContent = total === 0 ? 0 : from; // Если данных нет, показываем 0
        toRow.textContent = to;
        totalRows.textContent = total;
    };

    // Возвращаем функции для применения и обновления пагинации
    return {
        updatePagination,
        applyPagination
    };
};

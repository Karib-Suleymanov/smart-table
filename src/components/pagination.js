import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // Подготавливаем шаблон кнопки страницы и очищаем контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true); // Берём первый элемент как шаблон
    pages.firstElementChild.remove(); // Удаляем его (можно удалить всё содержимое при необходимости)

    return (data, state, action) => {
        // Вычисляем количество страниц и объявляем нужные переменные
        const rowsPerPage = state.rowsPerPage; // Количество строк на страницу
        const pageCount = Math.ceil(data.length / rowsPerPage); // Общее число страниц
        let page = state.page; // Текущая страница (может изменяться при действиях)

        // Обрабатываем действия пагинации
        if (action) switch (action.name) {
            case 'prev': page = Math.max(1, page - 1); break; // Предыдущая страница
            case 'next': page = Math.min(pageCount, page + 1); break; // Следующая страница
            case 'first': page = 1; break; // Первая страница
            case 'last': page = pageCount; break; // Последняя страница
        }

        // Получаем список видимых страниц и отображаем их
        const visiblePages = getPages(page, pageCount, 5); // Показываем максимум 5 страниц
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true); // Клонируем шаблон кнопки
            return createPage(el, pageNumber, pageNumber === page); // Заполняем кнопку через колбэк
        }));

        // Обновляем отображаемый статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1; // С какой строки начинается вывод
        toRow.textContent = Math.min(page * rowsPerPage, data.length); // До какой строки выводим
        totalRows.textContent = data.length; // Общее количество строк (после фильтрации может измениться)

        // Получаем срез данных для текущей страницы
        const skip = (page - 1) * rowsPerPage; // Сколько строк нужно пропустить
        return data.slice(skip, skip + rowsPerPage); // Возвращаем нужную часть данных
    };
};

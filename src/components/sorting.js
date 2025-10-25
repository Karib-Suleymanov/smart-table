import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        // Обрабатываем нажатие на кнопку сортировки
        if (action && action.name === 'sort') {
            // Сохраняем выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // Определяем следующее состояние из карты
            field = action.dataset.field; // Получаем сортируемое поле
            order = action.dataset.value; // Получаем направление сортировки

            // Сбрасываем сортировку для остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none'; // Возвращаем в начальное состояние
                }
            });

        // Если сортировка не была изменена — получаем текущие настройки
        } else {
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field; // Поле для сортировки
                    order = column.dataset.value; // Направление сортировки
                }
            });
        }

        // Применяем сортировку к данным
        return sortCollection(data, field, order);
    };
}

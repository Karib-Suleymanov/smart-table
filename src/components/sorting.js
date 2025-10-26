import { sortMap } from "../lib/sort.js";


//  Инициализация сортировки таблицы
export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // Если была нажата кнопка сортировки
        if (action && action.name === 'sort') {
            // Запоминаем следующий режим сортировки из карты (например: none → asc → desc)
            action.dataset.value = sortMap[action.dataset.value];    
            field = action.dataset.field;   // Поле, по которому сортируем
            order = action.dataset.value;   // Направление сортировки

            // Сбрасываем сортировку для остальных колонок
            columns.forEach(column => {                                    
                if (column.dataset.field !== action.dataset.field) {    
                    column.dataset.value = 'none';                        
                }
            });
        } else {
            // Если сортировка не менялась — берём текущий активный режим
            columns.forEach(column => {                        
                if (column.dataset.value !== 'none') {        
                    field = column.dataset.field;            
                    order = column.dataset.value;            
                }
            });
        }

        // Формируем строку сортировки в виде "field:direction", если она есть
        const sort = (field && order !== 'none') ? `${field}:${order}` : null;

        // Добавляем параметр сортировки в query, если он определён
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}

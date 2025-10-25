import { createComparison, defaultRules } from "../lib/compare.js";

// Настраиваем компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            // Добавляем опции в каждый элемент
            elements[elementName].append(
                ...Object.values(indexes[elementName])
                    .map(name => {
                        // Создаём элемент <option> и задаём значение и текст
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            );
        });

    return (data, state, action) => {
        // Обрабатываем очистку поля
        if (action && action.name === 'clear') {
            action.parentElement.querySelector('input').value = '';
            const fieldName = action.dataset.field;
            return {
                ...state,
                [fieldName]: '' // Очищаем поле в state с таким же именем
            };
        }

        // Фильтруем данные с использованием компаратора
        return data.filter(row => compare(row, state));
    };
}

export function initFiltering(elements) {
    //   Добавление опций в выпадающие списки фильтра
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            // Добавляем <option> в соответствующий <select>
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                })
            );
        });
    };


    //   Формирование фильтра для запроса или очистка состояния
    const applyFiltering = (query, state, action) => {
        // Обработка нажатия на кнопку "Очистить"
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            if (state[field]) {
                state[field] = ''; // сбрасываем значение конкретного поля фильтра
            }
        }

        // Формируем объект фильтров на основе введённых значений
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && ['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                // Добавляем параметр вида filter[fieldName]=value
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        // Если есть активные фильтры — добавляем их к query
        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    // Возвращаем функции для обновления фильтров и их применения
    return {
        updateIndexes,
        applyFiltering
    };
}

import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // Настраиваем компаратор для поиска по нескольким полям
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // Фильтруем данные с использованием компаратора
        return data.filter(row => compare(row, state));
    };
}

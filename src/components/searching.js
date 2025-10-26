export function initSearching(searchField) {
    return (query, state, action) => {
        // Если в поле поиска что-то введено — добавляем параметр search в query
        return state[searchField]
            ? Object.assign({}, query, { search: state[searchField] })
            : query; // Если поле пустое — возвращаем query без изменений
    };
}

import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {
        tableTemplate, 
        rowTemplate, 
        before = ['search', 'header', 'filter'], 
        after = ['pagination'],
    } = settings;
    const root = cloneTemplate(tableTemplate);

    // Перебираем массив идентификаторов шаблонов до таблицы
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName); // Клонируем шаблон
        root.container.prepend(root[subName].container); // добавляем к таблице до
    });

    // Перебираем массив идентификаторов шаблонов после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName); // Клонируем шаблон
        root.container.append(root[subName].container); // добавляем к таблице после
    });

    // Обработчики событий
    root.container.addEventListener('change', () => {
        onAction();
    });
    root.container.addEventListener('reser', () => {
        setTimeout``(onAction);
    });
    root.container.addEventListener('submit', e =>{
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // Преобразуем данные в строки на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate); // Клонируем шаблон строки

            // Заполняем каждую строку данными
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key]; 
                }
            });

            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}
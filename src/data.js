import { makeIndex } from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

/**
 * Инициализация API для работы с сервером
 */
export function initData() {
    // Кэш данных
    let sellers, customers;
    let lastResult, lastQuery;

    // Преобразование записей под формат таблицы
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // Получение списков продавцов и покупателей
    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }
        return { sellers, customers };
    };

    // Получение записей о продажах
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        // Проверяем, не совпадает ли запрос с предыдущим
        if (lastQuery === nextQuery && !isUpdated) return lastResult;

        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return { getIndexes, getRecords };
}

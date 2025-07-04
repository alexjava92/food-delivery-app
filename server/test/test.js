const fetch = require('node-fetch');

// 🔐 Твои ключи
const APP_CLIENT_ID = '1912575664728651';
const APP_SECRET = '6ZGVUWYS9LZUEYBTTKWPNGTF';
const SERVICE_SECRET_KEY = '4rVPxeQxtV8ClzG88T8kZChz6oHCflDMMgTO2fkIAbi3J9uXX5iFtqq5jezEBR6NZmxbseHPhfn68eWLpE2pgMGP7Ergd6i253W6vBnQqzl0gyNJg2p6yb'; // ⚠️ Укажи реальный ключ

/**
 * Получить токен доступа
 */
async function getAccessToken() {
    const res = await fetch('https://online.sbis.ru/oauth/service/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            app_client_id: APP_CLIENT_ID,
            app_secret: APP_SECRET,
            secret_key: SERVICE_SECRET_KEY
        })
    });

    const data = await res.json();
    return data.token; // <-- по документации поле называется "token"
}

/**
 * Получить список точек продаж
 */
async function getSalesPoints() {
    try {
        const token = await getAccessToken();
        if (!token) throw new Error('Не удалось получить access token');

        const url = 'https://api.sbis.ru/retail/point/list?withPhones=true&withPrices=true&product=delivery';

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-SBISAccessToken': token
            }
        });

        const data = await res.json();
        console.log('Список точек продаж:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Ошибка:', e);
    }
}

async function getMenu(token, pointId) {
    const actualDate = new Date().toISOString().replace('T', ' ').substring(0, 19); // формат: "ГГГГ-ММ-ДД ЧЧ:ММ:СС"

    const params = new URLSearchParams({
        pointId: pointId.toString(),
        actualDate
    });

    const url = `https://api.sbis.ru/retail/nomenclature/price-list?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-SBISAccessToken': token
            }
        });

        const data = await res.json();
        console.log(`Меню для точки #${pointId}:`, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Ошибка при получении меню:', e);
    }
}

async function run() {
    try {
        const token = await getAccessToken();

        const res = await fetch('https://api.sbis.ru/retail/point/list?withPhones=true&withPrices=true&product=delivery', {
            method: 'GET',
            headers: { 'X-SBISAccessToken': token }
        });

        const points = await res.json();
        const pointList = points.salesPoints;

        if (!Array.isArray(pointList) || pointList.length === 0) {
            console.log('Нет доступных точек продаж.');
            return;
        }

        const firstPoint = pointList[0];
        console.log('Первая точка:', firstPoint);

        // Получаем меню по первой точке
        await getMenu(token, firstPoint.id);

    } catch (e) {
        console.error('Ошибка в run():', e);
    }
}

run();

// Вызов
getSalesPoints();

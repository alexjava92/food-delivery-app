// app/contacts/page.tsx
import React from 'react';

const ContactsPage = () => {
    return (
        <div className="container">
            <h1 className="title">Контакты</h1>

            <p className="text"><strong>Адрес заведения:</strong> ул. 3-я Заречная д. 1</p>
            <p className="text"><strong>Номер телефона:</strong> <a href="tel:+79807346224">+7 980 734 6224</a></p>
            <p className="text"><strong>Часы работы:</strong></p>
            <ul className="text">
                <li>Пн–Пт: с 10:00 до 23:00</li>
                <li>Сб–Вс: с 10:00 до 24:00</li>
            </ul>
        </div>
    );
};

export default ContactsPage;

// app/contacts/page.tsx
'use client';

import React, { useState } from 'react';
import styles from './ContactsPage.module.scss';
import { FiCopy } from 'react-icons/fi';

const ContactsPage = () => {
    const [copied, setCopied] = useState(false);

    const phone = '+7 980 734 6224';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Контакты</h1>

            <p className={styles.text}><strong>Адрес заведения:</strong> ул. 3-я Заречная д. 1</p>

            <p className={styles.text}>
                <strong>Номер телефона:</strong>{' '}
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                <button className={styles.copyBtn} onClick={handleCopy} aria-label="Копировать номер">
                    <FiCopy size={18} />
                </button>
                {copied && <span className={styles.copiedText}>Скопировано!</span>}
            </p>

            <p className={styles.text}><strong>Часы работы:</strong></p>
            <ul className={styles.text}>
                <li>Пн–Пт: с 10:00 до 23:00</li>
                <li>Сб–Вс: с 10:00 до 24:00</li>
            </ul>
        </div>
    );
};

export default ContactsPage;

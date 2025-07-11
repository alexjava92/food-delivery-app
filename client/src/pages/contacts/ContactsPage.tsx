'use client';

import React, { useState } from 'react';
import styles from './ContactsPage.module.scss';
import { Store, Phone, Clock, Copy } from 'lucide-react';

const ContactsPage = () => {
    const [copied, setCopied] = useState(false);
    const phone = '+7 980 734 6224';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Контакты</h1>

            <div className={styles.card}>
                <Store size={20} className={styles.icon} />
                <div className={styles.info}>
                    <div className={styles.label}>Адрес заведения</div>
                    <div className={styles.value}>ул. 3-я Заречная д. 1</div>
                </div>
            </div>

            <div className={styles.card}>
                <Phone size={20} className={styles.icon} />
                <div className={styles.info}>
                    <div className={styles.label}>Телефон</div>
                    <div className={styles.phoneRow}>
                        <a href="tel:+79807346224" className={styles.link}>{phone}</a>
                        <button onClick={handleCopy} className={styles.copyBtn} aria-label="Скопировать">
                            <Copy size={16} />
                        </button>
                        {copied && <span className={styles.copied}>Скопировано</span>}
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <Clock size={20} className={styles.icon} />
                <div className={styles.info}>
                    <div className={styles.label}>Часы работы</div>
                    <div className={styles.value}>
                        <div>Пн–Пт: 10:00–23:00</div>
                        <div>Сб–Вс: 10:00–24:00</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;

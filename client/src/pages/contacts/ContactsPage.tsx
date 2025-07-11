'use client';

import React, { useState } from 'react';

import styles from './ContactsPage.module.scss';
import { Store, Phone, Clock, Copy } from 'lucide-react';
import {useGetContactsQuery} from "../../store/API/contactsApi";
import {MainLayout} from "../../layout/mainLayout";


const ContactsPage = () => {
    const { data, isLoading, isError } = useGetContactsQuery(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    return (
        <MainLayout heading="Контакты">
            <div className={styles.wrapper}>
                {isLoading && <p>Загрузка...</p>}
                {isError && <p>Ошибка загрузки данных</p>}
                {data && (
                    <>
                        <div className={styles.card}>
                            <Store size={20} className={styles.icon} />
                            <div className={styles.info}>
                                <div className={styles.label}>Адрес заведения</div>
                                <div className={styles.value}>{data.address}</div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <Phone size={20} className={styles.icon} />
                            <div className={styles.info}>
                                <div className={styles.label}>Телефон</div>
                                <div className={styles.phoneRow}>
                                    <a href={`tel:${data.phone.replace(/\s/g, '')}`} className={styles.link}>
                                        {data.phone}
                                    </a>
                                    <button onClick={() => handleCopy(data.phone)} className={styles.copyBtn}>
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
                                    {data.worktime.split('\n').map((line: string, i: number) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default ContactsPage;

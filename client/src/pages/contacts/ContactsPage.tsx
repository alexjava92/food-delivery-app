'use client';

import React, { useState } from 'react';
import styles from './ContactsPage.module.scss';
import { Store, Phone, Clock, Copy, MapPin } from 'lucide-react';
import { useGetContactsQuery } from "../../store/API/contactsApi";
import { MainLayout } from "../../layout/mainLayout";
import {useTelegram} from "../../hooks/useTelegram";

const ContactsPage = () => {
    const { tg } = useTelegram();
    const { data, isLoading, isError } = useGetContactsQuery(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            /*setCopied(true);
            setTimeout(() => setCopied(false), 2000);*/
            tg?.showPopup({ message: 'Скопировано!' });
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    };

    return (
        <MainLayout heading="Контакты">
            <div className={styles.wrapper}>
                {isLoading && (
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeletonCard} />
                        <div className={styles.skeletonCard} />
                        <div className={styles.skeletonCard} />
                    </div>
                )}
                {isError && <p className={styles.errorText}>Ошибка загрузки данных. Попробуйте позже.</p>}
                {data && (
                    <>
                        <div className={styles.card}>
                            <Store size={24} className={styles.icon} />
                            <div className={styles.info}>
                                <div className={styles.label}>Адрес заведения</div>
                                <div className={styles.value}>{data.address}</div>
                                <a
                                    href={`https://yandex.com/maps/?text=${encodeURIComponent(data.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.mapLink}

                                >
                                    <MapPin size={16} className={styles.mapIcon} />
                                    Открыть в Яндекс.Картах
                                </a>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <Phone size={24} className={styles.icon} />
                            <div className={styles.info}>
                                <div className={styles.label}>Телефон</div>
                                <div
                                    className={styles.phoneRow}
                                    onClick={() => handleCopy(data.phone)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <span className={styles.link}>{data.phone}</span>
                                    <Copy size={18} className={styles.copyIcon} />
                                    {copied && <span className={styles.copied}>Скопировано!</span>}
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <Clock size={24} className={styles.icon} />
                            <div className={styles.info}>
                                <div className={styles.label}>Часы работы</div>
                                <div className={styles.value}>
                                    {data.worktime.split('\n').map((line: string, i: number) => (
                                        <p key={i} className={styles.workLine}>{line}</p>
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
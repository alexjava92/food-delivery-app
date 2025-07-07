// src/pages/blocked/BlockedPage.tsx
import React from "react";
import { MainLayout } from "../../layout/mainLayout";

const BlockedPage = () => {
    return (
        <MainLayout heading="Доступ ограничен">
            <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem" }}>
                ❌ Ваш доступ был заблокирован администрацией.
                <br />
                Если это ошибка — обратитесь в службу поддержки.
            </div>
        </MainLayout>
    );
};

export default BlockedPage;

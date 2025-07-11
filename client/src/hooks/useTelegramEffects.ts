import {useTelegram} from "./useTelegram";

export function useTelegramEffects() {
    const { tg } = useTelegram();

    const triggerEmoji = (emoji: string) => {
        try {

            if (tg?.postEvent) {
                tg.postEvent('web_app_trigger_animation', { emoji });
            } else {
                console.warn('Telegram WebApp emoji animation not supported');
            }
        } catch (error) {
            console.error('Failed to trigger emoji animation:', error);
        }
    };

    return {
        triggerEmoji,
    };
}

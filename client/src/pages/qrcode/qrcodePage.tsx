import  classes from "./qrcode.module.scss"
import {MainLayout} from "../../layout/mainLayout"


const QrcodePage = () => {

    return (

            <div className={classes.qrcode}>
                <h2 className={'mb-4'}>Для заказа перейдите по ссылке или сканируйте QR код</h2>
                <a className={classes.link} href="https://t.me/javatest92_bot">Перейти по ссылке</a>
                <img className={classes.image} src={`${process.env.REACT_APP_API_URL}qrcode.png`} alt="qrcode"/>
            </div>

    );
};
export default QrcodePage;

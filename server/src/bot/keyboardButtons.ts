import {Injectable} from "@nestjs/common";


@Injectable()
export class KeyboardButtons {
    keyboardBtn :{}
constructor() {
    this.keyboardBtn={
        inline:[
            [
                {text: 'Контакты', callback_data: 'contacts',},
                {text: 'Приветственное сообщение', callback_data: 'welcomeMessage',}
            ]
        ],
            keyboard:[

        ]
    }
}

}
import { Component } from '@angular/core';
import { UI } from '@junte/ui';
import { CURRENT_LANGUAGE } from '../../../consts';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-lp-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {

  ui = UI;
  localUi = LocalUI;

  reviews: { name, avatar, position, text }[] = (() => {
    switch (CURRENT_LANGUAGE) {
      case Language.ru:
        return [
          {
            name: 'Антон Бреславский',
            avatar: '',
            position: 'Лидер команды Junte',
            text: 'Проджектор стал открытием для нашей команды, который позволил не только выстроить процесс разработки, но повысить лояльность клиентов.'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Менеджер проектов в Garpix',
            text: 'Мы ушли от Google Docs и теперь все ТЗ пишем в проджекторе - это удобно и поддерживаемо.'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader as Junte',
            text: 'Время разработки ТЗ для сайтов и мобильных приложений в нашей студии сократилось в 2 раза, а главное все теперь вся информация остается актуальной в процессе разработчки.'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader as Junte',
            text: 'Проджектор стал открытием для нашей команды который позволил настроить процесс разработки.'
          }
        ];
        break;
      case Language.en:
      default:
        return [
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader at Junte',
            text: 'It is super product!'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader as Junte',
            text: 'It is super product!'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader as Junte',
            text: 'It is super product!'
          },
          {
            name: 'Anton Breslavsky',
            avatar: '',
            position: 'Team Leader as Junte',
            text: 'It is super product!'
          }
        ];
    }
  })();

}

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
            name: 'Владимир Концов',
            avatar: '',
            position: 'Менеджер в Involta',
            text: 'Проджектор стал открытием для нашей команды, который позволил не только выстроить процесс разработки, но и повысить лояльность клиентов.'
          },
          {
            name: 'Иван Иванов',
            avatar: '',
            position: 'Менеджер проектов в Garpix',
            text: 'Мы ушли от Google Docs и Microsoft Word и теперь все ТЗ пишем в проджекторе - это удобно и поддерживаемо.'
          },
          {
            name: 'Андрей Морковкин',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'Директор CADesign',
            text: 'Время разработки технических заданий для сайтов в нашей студии сократилось в 2 раза, а главное теперь вся информация остается актуальной в процессе разработки.'
          },
          {
            name: 'Dr. Maik Rosenheinrich',
            avatar: 'assets/images/reviews/maik.jpeg',
            position: 'Глава ИТ в Esanum Gmbh, Германия',
            text: 'Проджектор стал хорошим дополнением к существующим Jira и Confluence. Прямые ссылки позволяют быстро переходить на нужные части описания системы.'
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
            name: 'Adnrey Morkovkin',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'CEO CADesign',
            text: 'It is super product!'
          },
          {
            name: 'Dr. Maik Rosenheinrich',
            avatar: 'assets/images/reviews/maik.jpeg',
            position: 'Head of esanum IT, Germany',
            text: 'Projector became a good addition to our Jira & Confluence. Direct links allow us make fast moving to required parts of system\'s description.'
          }
        ];
    }
  })();

}

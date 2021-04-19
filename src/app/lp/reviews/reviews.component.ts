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
            name: 'Dr. Maik Rosenheinrich',
            avatar: 'assets/images/reviews/maik.jpeg',
            position: 'Глава ИТ в Esanum Gmbh, Германия',
            text: 'Проджектор стал хорошим дополнением к существующим Jira и Confluence. Прямые ссылки позволяют быстро переходить на нужные части описания системы.'
          },
          {
            name: 'Ильдар Башаров',
            avatar: 'assets/images/reviews/ildar.jpeg',
            position: 'Менеджер проектов в Garpix',
            text: 'Мы ушли от Google Docs и Microsoft Word и теперь все ТЗ пишем в проджекторе - это удобно и поддерживаемо.'
          },
          {
            name: 'Андрей Морковкин',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'Директор CADesign',
            text: 'Время написания технических заданий для сайтов в нашей студии сократилось в 2 раза, а главное теперь вся информация остается актуальной в процессе разработки.'
          },
          {
            name: 'Владимир Концов',
            avatar: 'assets/images/reviews/vladimir.jpeg',
            position: 'Основатель Involta Design',
            text: 'Проджектор стал открытием для нашей команды, который позволил не только выстроить процесс разработки, но и повысить лояльность клиентов.'
          }
        ];
        break;
      case Language.en:
      default:
        return [
          {
            name: 'Dr. Maik Rosenheinrich',
            avatar: 'assets/images/reviews/maik.jpeg',
            position: 'Head of IT in Esanum Gmbh, Germany',
            text: 'Projector became a good addition for Jira & Confluence. Direct links allow go to required parts of the system fastly.'
          },
          {
            name: 'Ildar Basharov',
            avatar: 'assets/images/reviews/ildar.jpeg',
            position: 'Project Manager in Garpix',
            text: 'We gone away from Google Docs & Microsoft Word and we are writing all specifications in Projector - it is comfortable & useful.'
          },
          {
            name: 'Andrey Morkovkin',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'CEO CADesign',
            text: 'Time for making specifications have been decreased in 2 times and main is all information is staying actual in developing process.'
          },
          {
            name: 'Vladimir Konzov',
            avatar: 'assets/images/reviews/vladimir.jpeg',
            position: 'Founder Involta Design',
            text: 'Projector became a revelation for our team which allowed to build development process and increase clients loyalty.'
          }
        ];
    }
  })();

}

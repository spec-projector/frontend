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
            position: 'Глава ИТ в <a target="_blank" href="//www.esanum.de">Esanum Gmbh</a>, Германия',
            text: 'Проджектор стал хорошим дополнением к существующим Jira и Confluence. Прямые ссылки позволяют быстро переходить на нужные части описания системы.'
          },
          {
            name: 'Ильдар Башаров',
            avatar: 'assets/images/reviews/ildar.jpeg',
            position: 'Менеджер проектов в <a target="_blank" href="//www.garpix.com">Garpix</a>',
            text: 'Мы ушли от Google Docs и Microsoft Word и теперь все ТЗ пишем в проджекторе - это удобно и поддерживаемо.'
          },
          {
            name: 'Андрей Морковкин',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'Директор <a target="_blank" href="//https://cadesign.ru/">CADesign</a>',
            text: 'Время написания технических заданий для сайтов в нашей студии сократилось в 2 раза, а главное теперь вся информация остается актуальной в процессе разработки.'
          },
          {
            name: 'Вадим Оглобин',
            avatar: 'assets/images/reviews/vladimir.jpeg',
            position: 'Основатель <a target="_blank" href="//www.jobdriver24.ru">JobDriver24</a>',
            text: 'С точки зрения заказчика, проджектор обеспечил прозрачную оценку стоимость разработки моего проекта. Набор функций, дизайн, стоимость - все в одном месте.'
          }
        ];
        break;
      case Language.en:
      default:
        return [
          {
            name: 'Dr. Maik Rosenheinrich',
            avatar: 'assets/images/reviews/maik.jpeg',
            position: 'Head of IT in <a target="_blank" href="//www.esanum.de">Esanum Gmbh</a>, Germany',
            text: 'Projector became a good addition for Jira & Confluence. Direct links allow go to required parts of the system fastly.'
          },
          {
            name: 'Ildar Basharov',
            avatar: 'assets/images/reviews/ildar.jpeg',
            position: 'Project Manager in <a target="_blank" href="//www.garpix.com">Garpix</a>',
            text: 'We gone away from Google Docs & Microsoft Word and we are writing all specifications in Projector - it is comfortable & useful.'
          },
          {
            name: 'Andrey Morkovkin',
            avatar: 'assets/images/reviews/andrey.jpeg',
            position: 'CEO <a target="_blank" href="//www.cadesign.ru">CADesign</a>',
            text: 'Time for making specifications have been decreased in 2 times and main is all information is staying actual in developing process.'
          },
          {
            name: 'Vadim Oglobin',
            avatar: 'assets/images/reviews/vladimir.jpeg',
            position: 'Founder <a target="_blank" href="//www.jobdriver24.ru">JobDriver24</a>',
            text: 'From client side, projector provided transparent estimate costs of development my project. Features, design, costs all in one place.'
          }
        ];
    }
  })();

}

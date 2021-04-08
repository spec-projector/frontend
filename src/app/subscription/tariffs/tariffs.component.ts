import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';
import { Subscription } from '../../../models/subscription';
import { PagingTariffs, Tariff, TariffFeatures } from '../../../models/tariffs';
import { TariffsGQL } from './graphql';

@Component({
  selector: 'spec-lp-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  tariffFeatures = TariffFeatures;

  progress = {loading: false};
  tariffs: Tariff[] = [];

  @Input()
  subscription: Subscription;

  @Output()
  selected = new EventEmitter<Tariff>();

  constructor(@Inject(LOCALE_ID) public locale: string,
              private tariffsGQL: TariffsGQL) {
  }

  ngOnInit() {
    this.loadTariffs();
  }

  private loadTariffs() {
    this.progress.loading = true;
    return this.tariffsGQL.fetch()
      .pipe(finalize(() => this.progress.loading = false),
        map(({data: {tariffs}}) => deserialize(tariffs, PagingTariffs)))
      .subscribe(tariffs => this.tariffs = tariffs.results);
  }

  select(tariff: Tariff) {
    this.selected.emit(tariff);
  }

}
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Language } from '../../../enums/language';
import { PagingTariffs, Tariff, TariffFeatures } from '../../../models/tariffs';
import { AppConfig } from '../../app-config';
import { TariffsGQL } from '../graphql';

@Component({
  selector: 'spec-lp-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent implements OnInit {

  ui = UI;
  language = Language;
  tariffFeatures = TariffFeatures;

  progress = {loading: false};
  tariffs: Tariff[] = [];

  constructor(@Inject(LOCALE_ID) public locale: string,
              private tariffsGQL: TariffsGQL,
              private config: AppConfig,
              private router: Router) {
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

  buy(tariff: Tariff) {
    this.router.navigate([this.config.token ? '/subscription' : '/register', {tariff: tariff.id}])
      .then(() => null);
  }

}

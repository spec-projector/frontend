import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Me } from 'src/models/user';
import {
  CLOUD_PAYMENT_KEY,
  CLOUD_PAYMENT_RECURRENT_INTERVAL,
  CLOUD_PAYMENT_RECURRENT_PERIOD,
  CLOUD_PAYMENT_SKIN,
  PAYMENT_CURRENCY
} from '../../consts';
import { Language } from '../../enums/language';
import { LocalUI } from '../../enums/local-ui';
import { PagingTariffs, Tariff, TariffFeatures } from '../../models/tariffs';
import { TariffsGQL } from './graphql';
import { generate as shortid } from 'shortid';

declare var cp: {
  CloudPayments
};

@Component({
  selector: 'spec-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  tariffFeatures = TariffFeatures;

  progress = {loading: false};
  tariffs: Tariff[] = [];
  me: Me;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private tariffsGQL: TariffsGQL,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me, tariff}) => {
      this.me = me;
      if (!!tariff) {
        this.pay(tariff);
      }
    });
    this.loadTariffs();
  }

  private loadTariffs() {
    this.progress.loading = true;
    return this.tariffsGQL.fetch()
      .pipe(finalize(() => this.progress.loading = false),
        map(({data: {tariffs}}) => deserialize(tariffs, PagingTariffs)))
      .subscribe(tariffs => this.tariffs = tariffs.results);
  }

  pay(tariff: Tariff) {
    const widget = new cp.CloudPayments({
      language: (() => {
        switch (this.locale) {
          case Language.ru:
            return 'ru-RU';
          case Language.en:
          default:
            return 'en-US';
        }
      })()
    });

    const receipt = {
      Items: [
        {
          label: 'Service www.specprojector.com',
          price: tariff.price,
          quantity: 1.00,
          amount: tariff.price,
          vat: 20,
          method: 0,
          object: 0
        }
      ],
      taxationSystem: 0,
      email: this.me.email,
      phone: '',
      isBso: false,
      amounts:
        {
          electronic: tariff.price,
          advancePayment: 0.00,
          credit: 0.00,
          provision: 0.00
        }
    };

    const hash = shortid();
    const data = {
      user: this.me.id,
      tariff: tariff.id,
      hash,
      cloudPayments: {
        recurrent: {
          interval: CLOUD_PAYMENT_RECURRENT_INTERVAL,
          period: CLOUD_PAYMENT_RECURRENT_PERIOD,
          customerReceipt: receipt
        }
      }
    };

    // https://developers.cloudpayments.ru/#rekurrentnye-platezhi-podpiska
    widget.charge({
        publicId: CLOUD_PAYMENT_KEY,
        description: `Subscription on ${tariff.title} on www.specprojector.com`,
        amount: tariff.price,
        currency: PAYMENT_CURRENCY,
        accountId: this.me.email,
        skin: CLOUD_PAYMENT_SKIN,
        data: data
      },
      () => this.changeTariff(tariff, hash)
    );
  }

  changeTariff(tariff: Tariff, request: string) {

  }

}

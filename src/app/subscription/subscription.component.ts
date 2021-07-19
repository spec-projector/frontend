import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { addMonths } from 'date-fns';
import { Subject } from 'rxjs';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { generate as shortid } from 'shortid';
import { MeUser } from 'src/models/user';
import {
  CLOUD_PAYMENT_KEY,
  CLOUD_PAYMENT_RECURRENT_INTERVAL,
  CLOUD_PAYMENT_RECURRENT_PERIOD,
  CLOUD_PAYMENT_SKIN,
  PAYMENT_CURRENCY
} from '../../consts';
import { Language } from '../../enums/language';
import { LocalUI } from '../../enums/local-ui';
import { ChangeSubscriptionRequest } from '../../models/subscription';
import { Tariff, TariffFeatures } from '../../models/tariff';
import { BackendError } from '../../types/gql-errors';
import { catchGQLErrors } from '../../utils/gql-errors';
import { ChangeSubscriptionGQL, CheckSubscriptionGQL } from './graphql';
import { ChangeSubscription } from './models';

const CHECK_INTERVAL = 5000;

declare var cp: {
  CloudPayments
};

@Component({
  selector: 'spec-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject();

  ui = UI;
  localUi = LocalUI;
  language = Language;

  errors: BackendError[] = [];
  progress = {changing: false, checking: false};

  tariffs: Tariff[] = [];
  me: MeUser;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private changeSubscriptionGQL: ChangeSubscriptionGQL,
              private checkSubscriptionGQL: CheckSubscriptionGQL,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me, tariff}) => {
      this.me = me;
      if (!!me.changeSubscriptionRequest) {
        this.checkSubscription();
      }
      if (!!tariff) {
        this.pay(tariff);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
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
      tariff_id: tariff.id,
      targetTariff: tariff.id,
      hash,
      cloudPayments: {
        recurrent: {
          Amount: tariff.price,
          StartDate: addMonths(new Date(), 1),
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
      }, d => {
        console.log(d);
        this.changeTariff(tariff, hash);
      }
    );
  }

  changeTariff(tariff: Tariff, hash: string = null) {
    const req = new ChangeSubscription({tariff: tariff.id, hash});
    this.progress.changing = true;
    this.changeSubscriptionGQL.mutate({input: serialize(req)})
      .pipe(finalize(() => this.progress.changing = false),
        catchGQLErrors(),
        map(({data: {response: {request}}}) => deserialize(request, ChangeSubscriptionRequest)))
      .subscribe(request => {
        this.me.changeSubscriptionRequest = request;
        this.checkSubscription();
      }, errors => this.errors = errors);
  }

  private checkSubscription() {
    this.progress.checking = true;
    this.checkSubscriptionGQL.fetch()
      .pipe(takeUntil(this.destroyed$),
        finalize(() => this.progress.checking = false),
        catchGQLErrors(),
        map(({data: {me}}) => deserialize(me, MeUser)))
      .subscribe(me => {
          this.me = me;
          if (!!me.changeSubscriptionRequest && me.changeSubscriptionRequest.toSubscription?.id !== me.subscription.id) {
            setTimeout(() => this.checkSubscription(), CHECK_INTERVAL);
          }
        },
        errors => this.errors = errors);
  }

}

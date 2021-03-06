import { Injectable } from '@angular/core';
import { EnumOption } from 'src/models/spec/orm/enum-option';
import { CURRENT_LANGUAGE } from '../../../consts';
import { Language } from '../../../enums/language';
import { Entity } from '../../../models/spec/orm/entity';
import { EntityField, FieldType } from '../../../models/spec/orm/entity-field';
import { Enum } from '../../../models/spec/orm/enum';
import { Actor } from '../../../models/spec/planning/actor';
import { Feature } from '../../../models/spec/planning/feature/feature';
import { StoryEntry, StoryEntryType } from '../../../models/spec/planning/feature/story';
import { Module } from '../../../models/spec/planning/module';
import { Sprint } from '../../../models/spec/planning/sprint';
import { Term } from '../../../models/spec/planning/term';
import { AccentToken, TermToken, TextToken, Token } from '../../../models/spec/planning/token';
import { ResourceType, Spec } from '../../../models/spec/spec';
import { Patch } from '../../../types/patch';

const I18N = (() => {
  switch (CURRENT_LANGUAGE) {
    case Language.ru:
      return {
        resourceTypes: {
          ui: 'UI/UX',
          backend: 'Бэкенд',
          frontend: 'Фротенд'
        },
        actors: {
          client: {
            title: 'Клиент',
            features: {
              catalog: {
                title: 'Каталог товаров'
              },
              productDetails: {
                title: 'Информация о товаре'
              },
              addToCart: {
                title: 'Добавить товар в корзину'
              },
              shoppingList: {
                title: 'Список покупок'
              },
              payOrder: {
                title: 'Оплатить заказ'
              }
            }
          },
          operator: {
            title: 'Оператор',
            features: {
              processOrder: {
                title: {
                  process: 'Обработать ',
                  order: 'заказ'
                }
              }
            }
          },
          carrier: {
            title: 'Курьер',
            features: {
              deliveriesList: {
                title: 'Список доставок'
              },
              deliveryOrder: {
                title: 'Доставить заказ'
              }
            }
          },
          manager: {
            title: 'Менеджер',
            features: {
              salesReport: {
                title: 'Отчет по продажам'
              }
            }
          }
        },
        terms: {
          order: {
            title: 'Заказ',
            description: [new TextToken('Запрос клиента на доставку товаров из каталога')]
          }
        },
        modules: {
          nomenclature: {
            title: 'Номенклатура'
          },
          shoppingCart: {
            title: 'Корзина покупок'
          },
          orders: {
            title: 'Заказы'
          },
          delivery: {
            title: 'Доставка'
          },
          reports: {
            title: 'Отчеты'
          }
        },
        sprints: {
          keyFeatures: {
            title: 'Ключевые возможности'
          },
          shopping: {
            title: 'Покупка'
          },
          delivery: {
            title: 'Доставка'
          },
          reports: {
            title: 'Отчеты'
          }
        },
        entities: {
          productCategory: {
            title: 'Категория товаров',
            name: 'product_category'
          },
          product: {
            title: 'Товар',
            name: 'product'
          },
          order: {
            title: 'Заказ',
            name: 'order'
          }
        },
        enums: {
          orderState: {
            title: 'Статус заказа',
            name: 'order_state',
            options: {
              processing: {
                title: 'Обработка',
                name: 'processing'
              },
              canceled: {
                title: 'Отменен',
                name: 'canceled'
              },
              delivering: {
                title: 'Доставляется',
                name: 'delivering'
              },
              delivered: {
                title: 'Доставлен',
                name: 'delivered'
              }
            }
          }
        }
      };
      break;
    case Language.en:
    default:
      return {
        resourceTypes: {
          ui: 'UI/UX',
          backend: 'Backend',
          frontend: 'Frontend'
        },
        actors: {
          client: {
            title: 'Client',
            features: {
              catalog: {
                title: 'Products catalog'
              },
              productDetails: {
                title: 'Product details'
              },
              addToCart: {
                title: 'Add product to cart'
              },
              shoppingList: {
                title: 'Shopping list'
              },
              payOrder: {
                title: 'Pay order'
              }
            }
          },
          operator: {
            title: 'Operator',
            features: {
              processOrder: {
                title: {
                  process: 'Process an ',
                  order: 'order'
                }
              }
            }
          },
          carrier: {
            title: 'Carrier',
            features: {
              deliveriesList: {
                title: 'Deliveries list'
              },
              deliveryOrder: {
                title: 'Delivery order'
              }
            }
          },
          manager: {
            title: 'Manager',
            features: {
              salesReport: {
                title: 'Sales report'
              }
            }
          }
        },
        terms: {
          order: {
            title: 'Order',
            description: [new TextToken('Client\' request to deliver products from catalog')]
          }
        },
        modules: {
          nomenclature: {
            title: 'Nomenclature'
          },
          shoppingCart: {
            title: 'Shopping cart'
          },
          orders: {
            title: 'Orders'
          },
          delivery: {
            title: 'Delivery'
          },
          reports: {
            title: 'Reports'
          }
        },
        sprints: {
          keyFeatures: {
            title: 'Key features'
          },
          shopping: {
            title: 'Shopping'
          },
          delivery: {
            title: 'Delivery'
          },
          reports: {
            title: 'Reports'
          }
        },
        entities: {
          productCategory: {
            title: 'Product category',
            name: 'product_category'
          },
          product: {
            title: 'Product',
            name: 'product'
          },
          order: {
            title: 'Order',
            name: 'order'
          }
        },
        enums: {
          orderState: {
            title: 'Order state',
            name: 'order_state',
            options: {
              processing: {
                title: 'Processing',
                name: 'processing'
              },
              canceled: {
                title: 'Canceled',
                name: 'canceled'
              },
              delivering: {
                title: 'Delivering',
                name: 'delivering'
              },
              delivered: {
                title: 'Delivered',
                name: 'delivered'
              }
            }
          }
        }
      };
  }
})();

type Features = { catalog, productDetails, addToCart, shoppingList, payOrder, processOrder, deliveriesList, deliveryOrder, sales };

export enum FillMode {
  clear = 'clear',
  full = 'full'
}

@Injectable({providedIn: 'root'})
export class DemoManager {

  private spec: Spec;
  private patch: Patch;

  fill(spec: Spec, mode = FillMode.full): Patch {
    this.spec = spec;

    this.patch = {changed: [], deleted: []};

    this.clean();

    if (mode === FillMode.full) {
      this.create();
    }

    return this.patch;
  }

  private clean() {
    const links: Patch[] = [];

    Array.from(this.spec.actors).forEach(a => links.push(a.delete()));
    Array.from(this.spec.terms).forEach(t => links.push(t.delete()));
    Array.from(this.spec.model.entities).forEach(e => links.push(e.delete()));
    Array.from(this.spec.model.enums).forEach(e => links.push(e.delete()));
    Array.from(this.spec.modules).forEach(m => links.push(m.delete()));
    Array.from(this.spec.sprints).forEach(s => links.push(s.delete()));

    links.forEach(l => {
      this.patch.changed = this.patch.changed.concat(l.changed);
      this.patch.deleted = this.patch.deleted.concat(l.deleted);
    });
  }

  private create() {
    this.createResources();
    this.createTerms();
    const features = this.createFeatures();
    this.createSprints(features);
    const model = this.createModel();
    this.createModules(features, model);
  }

  private createResources() {
    this.spec.resourceTypes = [
      new ResourceType({title: I18N.resourceTypes.ui, hourRate: 15}),
      new ResourceType({title: I18N.resourceTypes.backend, hourRate: 30}),
      new ResourceType({title: I18N.resourceTypes.frontend, hourRate: 30})
    ];
    this.patch.changed.push(this.spec);
  }

  private createTerms() {
    this.createTerm(I18N.terms.order.title, I18N.terms.order.description);
  }

  private createFeatures(): Features {
    const [catalog, productDetails, addToCart, shoppingList, payOrder] = this.createActor(I18N.actors.client.title, [
      {
        title: [new TextToken(I18N.actors.client.features.catalog.title)],
        story: [
          new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('products categories')]
          }),
          new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('category card: '),
              new AccentToken('title'),
              new TextToken(', '),
              new AccentToken('picture')]
          })
        ]
      },
      {
        title: [new TextToken(I18N.actors.client.features.productDetails.title)]
      },
      {
        title: [new TextToken(I18N.actors.client.features.addToCart.title)]
      },
      {
        title: [new TextToken(I18N.actors.client.features.shoppingList.title)]
      },
      {
        title: [new TextToken(I18N.actors.client.features.payOrder.title)]
      }]);

    const [processOrder] = this.createActor(I18N.actors.operator.title, [
      {
        title: [new TextToken(I18N.actors.operator.features.processOrder.title.process),
          new TermToken(I18N.actors.operator.features.processOrder.title.order)]
      }
    ]);
    const [deliveriesList, deliveryOrder] = this.createActor(I18N.actors.carrier.title, [
      {
        title: [new TextToken(I18N.actors.carrier.features.deliveriesList.title)]
      },
      {
        title: [new TextToken(I18N.actors.carrier.features.deliveryOrder.title)]
      }
    ]);
    const [sales] = this.createActor(I18N.actors.manager.title, [
      {
        title: [new TextToken(I18N.actors.manager.features.salesReport.title)]
      }
    ]);

    return {catalog, productDetails, addToCart, shoppingList, payOrder, processOrder, deliveriesList, deliveryOrder, sales};
  }

  private createModel(): { productCategory, product, order, orderState } {
    const orderState = this.createEnum({
      title: I18N.enums.orderState.title,
      name: I18N.enums.orderState.name
    }, [
      {
        title: I18N.enums.orderState.options.processing.title,
        name: I18N.enums.orderState.options.processing.name
      },
      {
        title: I18N.enums.orderState.options.canceled.title,
        name: I18N.enums.orderState.options.canceled.name
      },
      {
        title: I18N.enums.orderState.options.delivering.title,
        name: I18N.enums.orderState.options.delivering.name
      },
      {
        title: I18N.enums.orderState.options.delivered.title,
        name: I18N.enums.orderState.options.delivered.name
      }
    ]);

    const productCategory = this.createEntity(
      {
        title: I18N.entities.productCategory.title,
        name: I18N.entities.productCategory.name
      },
      [
        {
          title: 'Slug',
          required: true
        },
        {
          title: 'Title',
          required: true
        }
      ]);

    const field = new EntityField({
      name: 'parent',
      title: 'parent',
      autoName: false,
      type: FieldType.reference,
      reference: productCategory.id
    });
    field.linking({spec: this.spec, entity: productCategory});
    field.new();
    this.patch.changed.push(field);

    productCategory.addField(field);
    this.patch.changed.push(productCategory);

    const product = this.createEntity(
      {
        title: I18N.entities.product.title,
        name: I18N.entities.product.name
      },
      [
        {
          title: 'Sku',
          required: true
        },
        {
          title: 'Title',
          required: true
        },
        {
          title: 'Price',
          type: FieldType.number,
          required: true
        },
        {
          title: 'Category',
          required: true,
          type: FieldType.reference,
          reference: productCategory.id
        }
      ]);
    const order = this.createEntity(
      {
        title: I18N.entities.order.title,
        name: I18N.entities.order.name
      },
      [
        {
          title: 'Number',
          required: true,
          type: FieldType.number
        },
        {
          title: 'Created',
          required: true,
          type: FieldType.date
        },
        {
          title: 'Delivery date',
          required: true,
          type: FieldType.date
        },
        {
          title: 'Client',
          required: true,
          type: FieldType.string
        },
        {
          title: 'Phone',
          type: FieldType.string,
          required: true
        },
        {
          title: 'Sum',
          required: true,
          type: FieldType.number
        },
        {
          title: 'State',
          required: true,
          type: FieldType.enum,
          enum: orderState.id
        }
      ]);

    return {productCategory, product, order, orderState};
  }

  private createSprints(features: Features) {
    this.createSprint(I18N.sprints.keyFeatures.title, [features.catalog, features.productDetails]);
    this.createSprint(I18N.sprints.shopping.title, [features.addToCart, features.shoppingList, features.payOrder, features.processOrder]);
    this.createSprint(I18N.sprints.delivery.title, [features.deliveriesList, features.deliveryOrder]);
    this.createSprint(I18N.sprints.reports.title, [features.sales]);
  }

  private createModules(features: Features, model) {
    this.createModule(I18N.modules.nomenclature.title,
      [features.catalog, features.productDetails],
      [model.productCategory, model.product]);
    this.createModule(I18N.modules.shoppingCart.title,
      [features.addToCart, features.shoppingList]);
    this.createModule(I18N.modules.orders.title,
      [features.payOrder, features.processOrder],
      [model.order],
      [model.orderState]);
    this.createModule(I18N.modules.delivery.title, [features.deliveriesList, features.deliveryOrder]);
    this.createModule(I18N.modules.reports.title, [features.sales]);
  }

  //

  private createActor(name: string, features: ({ title: Token[], story?: StoryEntry[] })[] = []): Feature[] {

    const actor = new Actor({
      name: name
    });
    actor.new();
    actor.linking(this.spec);
    this.patch.changed.push(actor);

    this.spec.actors.push(actor);
    this.patch.changed.push(this.spec);

    return features.map(f => {
      const feature = this.createFeature(actor, {
        title: f.title,
        story: f.story || []
      });
      actor.addFeature(feature);
      this.patch.changed.push(actor);

      return feature;
    });
  }

  private createFeature(actor: Actor, {title, story}): Feature {
    const feature = new Feature({
      title: title,
      story: story || []
    });
    feature.linking({spec: actor.spec, actor});
    feature.new().forEach(o => this.patch.changed.push(o));
    this.patch.changed.push(feature);

    return feature;
  }

  private createModule(title: string, features: Feature[] = [], entities: Entity[] = [], enums: Enum[] = []) {
    const module = new Module({
      title: title
    });
    module.linking(this.spec);
    module.new().forEach(o => this.patch.changed.push(o));

    this.spec.modules.push(module);
    this.patch.changed.push(this.spec);

    features.forEach(f => {
      f.linking({module});
      module.addFeature(f);
    });

    const {model} = module;
    entities.forEach(e => {
      e.linking({module});
      model.addEntity(e);
    });

    enums.forEach(e => {
      e.linking({module});
      model.addEnum(e);
    });

    this.patch.changed.push(model);
    module.model = model;
    this.patch.changed.push(module);
  }

  private createEntity({title, name}, fields: ({ title, required?, type?, reference?, enum? })[] = []): Entity {
    const entity = new Entity({
      title,
      name,
      autoName: false
    });
    entity.linking({spec: this.spec});
    entity.new();

    entity.fields = fields.map(f => {
      const field = new EntityField({
        name: f.title,
        title: f.title,
        autoName: false,
        required: f.required || false,
        type: f.type || FieldType.string,
        reference: f.reference || null,
        enum: f.enum || null
      });
      field.linking({spec: this.spec, entity});
      field.new();
      this.patch.changed.push(field);
      return field;
    });

    this.patch.changed.push(entity);

    this.spec.model.addEntity(entity);
    this.patch.changed.push(this.spec.model);

    return entity;
  }

  private createEnum({title, name}, options: ({ title, name })[] = []): Enum {
    const enum_ = new Enum({
      title,
      name,
      autoName: false
    });
    enum_.linking({spec: this.spec});
    enum_.new();

    enum_.options = options.map(o => {
      const option = new EnumOption({
        title: o.title,
        name: o.name,
        autoName: false
      });
      option.linking(enum_);
      option.new();
      this.patch.changed.push(option);
      return option;
    });

    this.patch.changed.push(enum_);

    this.spec.model.addEnum(enum_);
    this.patch.changed.push(this.spec.model);

    return enum_;
  }

  private createSprint(title: string, features: Feature[] = []) {
    const sprint = new Sprint({
      title: title
    });
    sprint.new();
    sprint.linking(this.spec);
    this.patch.changed.push(sprint);

    this.spec.sprints.push(sprint);
    this.patch.changed.push(this.spec);

    features.forEach(f => {
      f.linking({sprint});
      sprint.addFeature(f);
      this.patch.changed.push(sprint);
    });
  }

  private createTerm(name: string, description: Token[]) {
    const term = new Term({
      title: name,
      description
    });
    term.new();
    term.linking(this.spec);
    this.patch.changed.push(term);

    this.spec.terms.push(term);
    this.patch.changed.push(this.spec);
  }

}

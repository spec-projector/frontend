export enum FontLocalIcons {
    general = 'general',
    features = 'features',
    epics = 'epics',
    terms = 'terms',
    sprints = 'sprints',
    model = 'model',
    validate = 'validate'
}

export enum SvgLocalIcons {
    graphQl = 'graphql',
    restApi = 'rest',
}
export const FontIcons = {FontLocalIcons};
export type FontIcons = FontLocalIcons;

export const SvgIcons = {SvgLocalIcons};
export type SvgIcons = SvgLocalIcons;

export enum TypeIcon {
    font = 'font',
    svg = 'svg'
}

class ShortIcons {
    static icons = {
        sprints: FontLocalIcons.sprints + ':font',
        terms: FontLocalIcons.terms + ':font',
        epics: FontLocalIcons.epics + ':font',
        model: FontLocalIcons.model + ':font',
        features: FontLocalIcons.features + ':font',
        validate: FontLocalIcons.validate + ':font',
        general: FontLocalIcons.general + ':font',
        graphQl: SvgLocalIcons.graphQl + ':svg',
        rest: SvgLocalIcons.restApi + ':svg',
    };
}

export class LocalUI {
    static icons = {
        font: FontLocalIcons,
        svg: {
            default: SvgLocalIcons,
        },
        ...ShortIcons.icons
    };
}

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
    restApi = 'rest'
}

export class LocalUI {
    static icons = {
        font: FontLocalIcons,
        svg: {
            default: {
                graphQl: SvgLocalIcons.graphQl,
                rest: SvgLocalIcons.restApi
            }
        },
        sprints: FontLocalIcons.sprints + ':font:local',
        terms: FontLocalIcons.terms + ':font:local',
        epics: FontLocalIcons.epics + ':font:local',
        model: FontLocalIcons.model + ':font:local',
        features: FontLocalIcons.features + ':font:local',
        validate: FontLocalIcons.validate + ':font:local',
        general: FontLocalIcons.general + ':font:local',
        graphQl: SvgLocalIcons.graphQl + ':svg:local',
        rest: SvgLocalIcons.restApi + ':svg:local'
    };
}

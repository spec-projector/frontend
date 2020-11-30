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
    story = 'story',
    resources = 'resources',
    issues = 'issues'
}

export class LocalUI {
    static icons = {
        font: FontLocalIcons,
        svg: {
            default: {
                graphQl: SvgLocalIcons.graphQl,
                rest: SvgLocalIcons.restApi,
                story: SvgLocalIcons.story,
                resources: SvgLocalIcons.resources,
                issues: SvgLocalIcons.issues
            }
        },
        sprints: FontLocalIcons.sprints + ':font:icons',
        terms: FontLocalIcons.terms + ':font:icons',
        epics: FontLocalIcons.epics + ':font:icons',
        model: FontLocalIcons.model + ':font:icons',
        features: FontLocalIcons.features + ':font:icons',
        validate: FontLocalIcons.validate + ':font:icons',
        general: FontLocalIcons.general + ':font:icons',
        graphQl: SvgLocalIcons.graphQl + ':svg:local',
        rest: SvgLocalIcons.restApi + ':svg:local',
        story: SvgLocalIcons.story + ':svg:local',
        resources: SvgLocalIcons.resources + ':svg:local',
        issues: SvgLocalIcons.issues + ':svg:local'
    };
}

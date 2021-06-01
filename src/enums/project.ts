export enum ProjectPermission {
  editFeatures = 'EDIT_FEATURES',
  editFeatureWorkflow = 'EDIT_FEATURE_WORKFLOW',
  editFeatureStory = 'EDIT_FEATURE_STORY',
  editFeatureFrames = 'EDIT_FEATURE_FRAMES',
  editFeatureResources = 'EDIT_FEATURE_RESOURCES',
  editFeatureApi = 'EDIT_FEATURE_API',
  editFeatureIssues = 'EDIT_FEATURE_ISSUES',
  editTerms = 'EDIT_TERMS',
  editModel = 'EDIT_MODEL',
  editModules = 'EDIT_MODULES',
  editSprints = 'EDIT_SPRINTS',
  viewContract = 'VIEW_CONTRACT'
}

export const ALL_PROJECT_PERMISSIONS = [ProjectPermission.editFeatures,
  ProjectPermission.editFeatureWorkflow,
  ProjectPermission.editFeatureStory,
  ProjectPermission.editFeatureFrames,
  ProjectPermission.editFeatureResources,
  ProjectPermission.editFeatureApi,
  ProjectPermission.editFeatureIssues,
  ProjectPermission.editTerms,
  ProjectPermission.editModel,
  ProjectPermission.editModules,
  ProjectPermission.editSprints,
  ProjectPermission.viewContract,
];

export enum ProjectMemberRole {
  viewer = 'VIEWER',
  editor = 'EDITOR',
}

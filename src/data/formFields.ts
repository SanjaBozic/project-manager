// formFields.ts
export const TYPES = [
    'PBI','Bug','Defect','Task','Feature','Enhancement','Epic','Story','Spike','Hotfix','Refactor','Research','Documentation'
] as const;

export const STATES = [
    'Open','In Progress','Pending Review','Done','On Hold','Deployed','Removed'
] as const;

export const ACTIVITY_OPTIONS = [
    'Design','Development','Documentation','Testing','Requirements','Deployment'
] as const;

export const TAG_OPTIONS = [
    'accessibility','api','analytics','automation','backend','ci-cd','critical','database','deprecated','deployed','documentation','e2e-testing','frontend','goal','in-production','integration','integration-testing','localization','localization-testing','maintenance','monitoring','next-deploy','onboarding','observability','performance','prototype','regression-testing','research','scalability','security','smoke-testing','tech-debt','ui','unit-testing','urgent','ux'
] as const;

export const PRIORITY_OPTIONS = [1, 2, 3, 4, 5] as const;

export type FieldDef = {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    optional?: boolean;
    readonly?: boolean;
    fullWidth?: boolean;
    multiple?: boolean;
};

export const LEFT_FIELDS: readonly FieldDef[] = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Title', fullWidth: true },
    { key: 'tags', label: 'Tags', type: 'dropdown', placeholder: 'Select Tags', optional: true, multiple: true },
    { key: 'description', label: 'Description', type: 'editor', placeholder: 'Description', optional: true, fullWidth: true }
] as const;

export const DETAILS_FIELDS: readonly FieldDef[] = [
    { key: 'type', label: 'Type', type: 'dropdown', placeholder: 'Type' },
    { key: 'created', label: 'Created', type: 'date', placeholder: 'Created', readonly: true },
    { key: 'state', label: 'State', type: 'dropdown', placeholder: 'State' },
    { key: 'activity', label: 'Activity', type: 'dropdown', placeholder: 'Activity', optional: true },
    { key: 'originalEffort', label: 'Original Effort', type: 'number', placeholder: 'Original Effort', optional: true },
    { key: 'remainingEffort', label: 'Remaining Effort', type: 'number', placeholder: 'Remaining Effort', optional: true },
    { key: 'priority', label: 'Priority', type: 'dropdown', placeholder: 'Priority', optional: true },
    { key: 'assignedTo', label: 'Assigned To', type: 'text', placeholder: 'Assigned To', optional: true },
    { key: 'parentId', label: 'Parent Id', type: 'text', placeholder: 'Parent Id', optional: true }
] as const;
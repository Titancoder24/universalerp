/**
 * Workflow engine.
 *
 * Workflows are sequences of triggers and actions. The engine runs them
 * in response to events (record changes, schedule, webhooks) and tracks
 * execution state for resumability.
 */

export type TriggerType =
  | 'record_created'
  | 'record_updated'
  | 'record_deleted'
  | 'field_changed'
  | 'schedule_cron'
  | 'schedule_one_time'
  | 'webhook'
  | 'manual'
  | 'ai_prediction'
  | 'time_in_status';

export type ActionType =
  | 'create_record'
  | 'update_record'
  | 'delete_record'
  | 'send_email'
  | 'send_chat_message'
  | 'route_approval'
  | 'ai_draft'
  | 'ai_score'
  | 'webhook_call'
  | 'wait_duration'
  | 'wait_until'
  | 'wait_for_response'
  | 'conditional_branch'
  | 'loop_over_records'
  | 'assign_user'
  | 'create_task'
  | 'add_tag'
  | 'log_audit';

export interface Trigger {
  type: TriggerType;
  config: any;
  filters?: Array<{ field: string; operator: string; value: any }>;
}

export interface Action {
  id: string;
  type: ActionType;
  name: string;
  config: any;
  next?: string; // Next action ID
  next_if_true?: string; // For conditional
  next_if_false?: string;
  retry?: { attempts: number; backoff_seconds: number };
}

export interface WorkflowDefinition {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  enabled: boolean;
  triggers: Trigger[];
  actions: Action[];
  start_action_id: string;
  created_by: string;
  version: number;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  trigger_event: any;
  current_action_id?: string;
  context: Record<string, any>;
  step_history: Array<{
    action_id: string;
    started_at: string;
    completed_at?: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
    output?: any;
    error?: string;
  }>;
  started_at: string;
  completed_at?: string;
  error?: string;
}

/**
 * Execute a workflow step. Used by the worker that processes runs.
 */
export async function executeAction(action: Action, context: Record<string, any>): Promise<any> {
  switch (action.type) {
    case 'wait_duration':
      return { status: 'scheduled', resume_at: Date.now() + (action.config.seconds ?? 0) * 1000 };

    case 'conditional_branch':
      const condition = evaluateCondition(action.config.condition, context);
      return { branch: condition ? 'true' : 'false' };

    case 'create_record':
    case 'update_record':
    case 'send_email':
    case 'route_approval':
    case 'ai_draft':
    case 'webhook_call':
    case 'create_task':
      // Each action delegates to its handler module.
      return { action_type: action.type, params: action.config };

    default:
      return { skipped: true };
  }
}

function evaluateCondition(condition: any, context: Record<string, any>): boolean {
  if (!condition) return true;
  if (condition.type === 'and') {
    return condition.children.every((c: any) => evaluateCondition(c, context));
  }
  if (condition.type === 'or') {
    return condition.children.some((c: any) => evaluateCondition(c, context));
  }
  if (condition.type === 'not') {
    return !evaluateCondition(condition.child, context);
  }
  const left = resolveValue(condition.left, context);
  const right = resolveValue(condition.right, context);
  switch (condition.operator) {
    case 'eq': return left === right;
    case 'ne': return left !== right;
    case 'gt': return left > right;
    case 'gte': return left >= right;
    case 'lt': return left < right;
    case 'lte': return left <= right;
    case 'in': return Array.isArray(right) && right.includes(left);
    case 'contains': return String(left).includes(String(right));
    case 'starts_with': return String(left).startsWith(String(right));
    case 'ends_with': return String(left).endsWith(String(right));
    case 'is_null': return left === null || left === undefined;
    case 'is_not_null': return left !== null && left !== undefined;
    case 'is_empty': return !left || (Array.isArray(left) && left.length === 0);
    case 'is_not_empty': return !!left && (!Array.isArray(left) || left.length > 0);
    default: return false;
  }
}

function resolveValue(spec: any, context: Record<string, any>): any {
  if (typeof spec !== 'object' || spec === null) return spec;
  if (spec.literal !== undefined) return spec.literal;
  if (spec.path) {
    return spec.path.split('.').reduce((obj: any, key: string) => obj?.[key], context);
  }
  if (spec.expression) {
    return interpolate(spec.expression, context);
  }
  return spec;
}

export function interpolate(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
    const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], context);
    return value === undefined || value === null ? '' : String(value);
  });
}

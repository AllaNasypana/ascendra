import type { User, VMTemplate, VM, MetricPoint, Policy } from "@/types";
import {
  seedUsers,
  seedTemplates,
  seedVms,
  seedPolicies,
  seedMetricPoints,
} from "@/mocks/seed";
import { hashPassword } from "@/utils/auth";
import { DEMO_PASSWORD } from "@/constants/auth";



export interface AscendraStore {
  users: User[];
  templates: VMTemplate[];
  vms: VM[];
  policies: Policy[];
  metricPoints: Record<string, MetricPoint[]>;
  usersMap: Map<string, User>;
  usersByEmailMap: Map<string, User>;
  templatesMap: Map<string, VMTemplate>;
  vmsMap: Map<string, VM>;
}

const GLOBAL_KEY = "__ascendraStore";

export const rebuildIndexes = (store: AscendraStore): void => {
  store.usersMap.clear();
  store.usersByEmailMap.clear();
  for (const user of store.users) {
    store.usersMap.set(user.id, user);
    store.usersByEmailMap.set(user.email, user);
  }

  store.templatesMap.clear();
  for (const template of store.templates) {
    store.templatesMap.set(template.id, template);
  }

  store.vmsMap.clear();
  for (const vm of store.vms) {
    store.vmsMap.set(vm.id, vm);
  }
};

const createStore = (): AscendraStore => {
  const demoPasswordHash = hashPassword(DEMO_PASSWORD);

  const store: AscendraStore = {
    users: seedUsers.map((user) => ({
      ...user,
      passwordHash: demoPasswordHash,
    })),
    templates: structuredClone(seedTemplates),
    vms: structuredClone(seedVms),
    policies: structuredClone(seedPolicies),
    metricPoints: structuredClone(seedMetricPoints),
    usersMap: new Map(),
    usersByEmailMap: new Map(),
    templatesMap: new Map(),
    vmsMap: new Map(),
  };

  rebuildIndexes(store);
  return store;
};

/** Single process-wide store — survives duplicate module instances in Next.js dev/Turbopack. */
export const getStore = (): AscendraStore => {
  const globalRef = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: AscendraStore;
  };

  if (!globalRef[GLOBAL_KEY]) {
    globalRef[GLOBAL_KEY] = createStore();
  }

  return globalRef[GLOBAL_KEY];
};

export const resetDb = (): void => {
  const globalRef = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: AscendraStore;
  };
  globalRef[GLOBAL_KEY] = createStore();
};

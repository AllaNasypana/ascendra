import type { PublicUser, VM, VMTemplate } from '@/types';

export interface InventoryItem {
  vm: VM;
  owner?: PublicUser;
  template?: VMTemplate;
}

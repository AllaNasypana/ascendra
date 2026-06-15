import type { PublicUser } from "@/types";
import type { VMTemplate } from "@/types";
import type { VM, MetricPoint, FleetUtilization } from "@/types";
import { AUTH_KEY, CURRENT_USER_ID } from "@/constants";
import { request } from "@/utils";


export const authStorage = {
  getUserId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_KEY);
  },
  setUserId(id: string): void {
    localStorage.setItem(AUTH_KEY, id);
  },
  clear(): void {
    localStorage.removeItem(AUTH_KEY);
  },
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: PublicUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (
      name: string,
      email: string,
      password: string,
      role: PublicUser["role"]
    ) =>
      request<{ user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      }),
    me: (userId: string) => request<{ user: PublicUser }>(`/api/auth/me?${CURRENT_USER_ID}=${userId}`),
  },

  users: {
    list: () => request<{ users: PublicUser[] }>("/api/users"),
  },

  vms: {
    list: (params?: { ownerId?: string }) => {
      const search = params?.ownerId ? `?ownerId=${params.ownerId}` : "";
      return request<{ vms: VM[]; users: PublicUser[]; templates: VMTemplate[] }>(`/api/vms${search}`);
    },
    get: (id: string) => request<{ vm: VM; owner?: PublicUser; template?: VMTemplate }>(`/api/vms/${id}`),
    metrics: (id: string) => request<{ metrics: MetricPoint[] }>(`/api/vms/${id}/metrics`),
    start: (id: string) => request<{ vm: VM }>(`/api/vms/${id}/start`, { method: "POST" }),
    stop: (id: string) => request<{ vm: VM }>(`/api/vms/${id}/stop`, { method: "POST" }),
    restart: (id: string) => request<{ vm: VM }>(`/api/vms/${id}/restart`, { method: "POST" }),
  },

  templates: {
    list: () => request<{ templates: VMTemplate[] }>("/api/templates"),
    get: (id: string) => request<{ template: VMTemplate }>(`/api/templates/${id}`),
    create: (data: Omit<VMTemplate, "id">) =>
      request<{ template: VMTemplate }>("/api/templates", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Omit<VMTemplate, "id">>) =>
      request<{ template: VMTemplate }>(`/api/templates/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  fleet: {
    get: (period?: FleetUtilization["period"]) => {
      const search = period ? `?period=${period}` : "";
      return request<{ fleet: FleetUtilization }>(`/api/fleet${search}`);
    },
  },
};



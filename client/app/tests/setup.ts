import { vi } from "vitest";
import { ref } from "vue";

vi.stubGlobal("useState", (key: string, init: () => any) => ref(init()));

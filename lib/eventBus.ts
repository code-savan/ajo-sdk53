type Listener = (payload?: any) => void;

class SimpleEventBus {
  private listeners: Record<string, Set<Listener>> = {};

  on(event: string, cb: Listener) {
    if (!this.listeners[event]) this.listeners[event] = new Set();
    this.listeners[event].add(cb);
  }

  off(event: string, cb: Listener) {
    this.listeners[event]?.delete(cb);
  }

  emit(event: string, payload?: any) {
    const set = this.listeners[event];
    if (!set) return;
    for (const cb of Array.from(set)) {
      try { cb(payload); } catch {}
    }
  }
}

export const eventBus = new SimpleEventBus();

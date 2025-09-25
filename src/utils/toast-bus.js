export const toastBus = {
    _handlers: new Set(),
    on(handler) {
        this._handlers.add(handler);
    },
    off(handler) {
        this._handlers.delete(handler);
    },
    emit(payload) {
        for (const h of Array.from(this._handlers)) {
            try { h(payload); } catch (e) { /* no-op */ }
        }
    }
};

export const toast = {
    show: (msg, opts) => toastBus.emit({ msg, ...(opts || {}) }),
    success: (msg, title = 'Success') => toastBus.emit({ msg, title, bg: 'success' }),
    error: (msg, title = 'Error') => toastBus.emit({ msg, title, bg: 'danger', delay: 6000 }),
    info: (msg, title = 'Info') => toastBus.emit({ msg, title, bg: 'info' }),
    warning: (msg, title = 'Warning') => toastBus.emit({ msg, title, bg: 'warning' }),
};

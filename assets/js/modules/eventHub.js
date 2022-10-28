class EventHub {
    constructor(target) {
        this.events = new Map();
        this.target = target;
    }

    dispatch(eventName, detail = null) {
        const event = this.events.get(eventName);
        if (event) {
            const filtered = event.filter(item => {
                item.callback(detail);
                return !item.options.once;
            });

            this.events.set(eventName, filtered);
        }
    }

    on(eventName, callback, options = { once: false }) {
        const event = this.events.get(eventName);
        if (event) {
            event.push({ callback, options });
        } else {
            this.events.set(eventName, [{ callback, options }]);
        }

        this.target.addEventListener(eventName, callback, options);
    }

    off(eventName) {
        const event = this.events.get(eventName);
        if (event) {
            event.forEach(event => {
                this.target.removeEventListener(eventName, event.callback);
            });

            this.events.delete(eventName);
        }
    }

    offAll() {
        if (!this.events.size) {
            return;
        }

        [...this.events].forEach(event => {
            const [eventName, values] = event;

            values.forEach(({ callback }) => {
                this.target.removeEventListener(eventName, callback);
            });
        });

        this.events.clear();
    }
}

const event = new EventHub(globalThis);

export default event;

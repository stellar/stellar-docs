import { useEffect, useState } from 'react';

function useScript(src: string) {
    // Keep track of script status ("idle", "loading", "ready", "error")
    const [status, setStatus] = useState(src ? 'loading' : 'idle');

    useEffect(() => {
        // Allow falsy src value if waiting on other data needed for
        // constructing the script URL passed to this hook.
        if (!src) {
            setStatus('idle');
            return;
        }

        // Fetch existing script element by src
        // It may have been added by another intance of this hook
        let script: HTMLScriptElement | null = document.querySelector(
            `script[src="${src}"]`
        );

        if (!script) {
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.setAttribute('data-status', 'loading');
            document.body.appendChild(script);

            // Store status in attribute on script
            // This can be read by other instances of this hook
            const setAttributeFromEvent = (event: Event) => {
                if (script) {
                    script.setAttribute(
                        'data-status',
                        event.type === 'load' ? 'ready' : 'error'
                    );
                }
            };

            script.addEventListener('load', setAttributeFromEvent);
            script.addEventListener('error', setAttributeFromEvent);
        } else {
            const existingStatus = script.getAttribute('data-status');
            if (existingStatus) setStatus(existingStatus);
        }

        // Script event handler to update status in state
        // Note: Even if the script already exists we still need to add
        // event handlers to update the state for *this* hook instance.
        const setStateFromEvent = (event: Event) => {
            setStatus(event.type === 'load' ? 'ready' : 'error');
        };

        script.addEventListener('load', setStateFromEvent);
        script.addEventListener('error', setStateFromEvent);

        return () => {
            if (script) {
                script.removeEventListener('load', setStateFromEvent);
                script.removeEventListener('error', setStateFromEvent);
            }
        };
    }, [src]);
    return status;
}

export default useScript;

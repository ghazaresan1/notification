let portalActive = false;
const connections = new Set();

self.onconnect = (e) => {
    const port = e.ports[0];
    connections.add(port);
    
    port.onmessage = (e) => {
        if (e.data.type === 'portalActive') {
            portalActive = e.data.active;
            // Broadcast to all connected tabs
            connections.forEach(p => p.postMessage({ active: portalActive }));
        }
    };
    
    // Send initial state
    port.postMessage({ active: portalActive });
};

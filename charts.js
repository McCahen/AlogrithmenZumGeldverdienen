/**
 * Universelle Zeichenfunktion für den Algo-Workshop
 * Erwartet: Ein <canvas id="chart">, ein Array 'history' (Preise) 
 * und optional ein Array 'portfolioHistory'.
 */
function drawChart() {
    const canvas = document.getElementById('chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Dynamische Breite an den Container anpassen
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const padding = { top: 20, right: 20, bottom: 30, left: 65 };
    const w = canvas.width - padding.left - padding.right;
    const h = canvas.height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof history === 'undefined' || history.length < 2) return;

    // Skalierung berechnen
    const minP = Math.min(...history) * 0.98;
    const maxP = Math.max(...history) * 1.02;

    const getX = (i) => padding.left + (i / (history.length > 1 ? history.length - 1 : 1)) * w;
    const getY = (v) => canvas.height - padding.bottom - ((v - minP) / (maxP - minP)) * h;

    // --- Y-Achsen Legende & Hilfslinien ---
    ctx.strokeStyle = "#f1f5f9"; // Sehr helle Linien
    ctx.fillStyle = "#94a3b8";   // Grauer Text
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const val = minP + (maxP - minP) * (i / steps);
        const yPos = getY(val);
        
        // Wert links anzeigen
        ctx.fillText(val.toFixed(2) + " €", padding.left - 10, yPos + 4);
        
        // Horizontale Linie
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(canvas.width - padding.right, yPos);
        ctx.stroke();
    }

    // --- Kursverlauf (Grau & Gestrichelt) ---
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    history.forEach((v, i) => {
        i === 0 ? ctx.moveTo(getX(i), getY(v)) : ctx.lineTo(getX(i), getY(v));
    });
    ctx.stroke();

    // --- Portfolio/Erfolg (HSG Grün & Fett) ---
    if (typeof portfolioHistory !== 'undefined' && portfolioHistory.length > 1) {
        const minPort = Math.min(...portfolioHistory) * 0.98;
        const maxPort = Math.max(...portfolioHistory) * 1.02;
        const getYPort = (v) => canvas.height - padding.bottom - ((v - minPort) / (maxPort - minPort)) * h;

        ctx.setLineDash([]); // Durchgezogene Linie
        ctx.strokeStyle = "#006b4d"; // HSG GRÜN
        ctx.lineWidth = 3;
        ctx.beginPath();
        portfolioHistory.forEach((v, i) => {
            i === 0 ? ctx.moveTo(getX(i), getYPort(v)) : ctx.lineTo(getX(i), getYPort(v));
        });
        ctx.stroke();
    }
}

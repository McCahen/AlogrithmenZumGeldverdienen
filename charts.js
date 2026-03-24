/**
 * Universelle Zeichenfunktion für den Algo-Workshop
 * Mit dualer Achse und Legende.
 */
function drawChart() {
    const canvas = document.getElementById('chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const padding = { top: 40, right: 75, bottom: 30, left: 65 };
    const w = canvas.width - padding.left - padding.right;
    const h = canvas.height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof history === 'undefined' || history.length < 2) return;

    // --- Skalierung Preis (Links) ---
    const minP = Math.min(...history) * 0.98;
    const maxP = Math.max(...history) * 1.02;
    const getX = (i) => padding.left + (i / (history.length > 1 ? history.length - 1 : 1)) * w;
    const getY = (v) => canvas.height - padding.bottom - ((v - minP) / (maxP - minP)) * h;

    // --- Skalierung Portfolio (Rechts) ---
    let minPort = 0, maxPort = 0, getYPort = null;
    const hasPortfolio = typeof portfolioHistory !== 'undefined' && portfolioHistory.length > 1;
    
    if (hasPortfolio) {
        minPort = Math.min(...portfolioHistory) * 0.95;
        maxPort = Math.max(...portfolioHistory) * 1.05;
        getYPort = (v) => canvas.height - padding.bottom - ((v - minPort) / (maxPort - minPort)) * h;
    }

    // --- Legende (Oben links & rechts) ---
    ctx.font = "bold 11px sans-serif";
    
    // Kurs-Label (Links)
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";
    ctx.fillText("--- Kurs (CHF)", padding.left, 20);

    // Portfolio-Label (Rechts)
    if (hasPortfolio) {
        ctx.fillStyle = "#006b4d";
        ctx.textAlign = "right";
        ctx.fillText("━ Portfolio (CHF total)", canvas.width - padding.right, 20);
    }

    // --- Raster & Achsen ---
    ctx.setLineDash([]); 
    ctx.lineWidth = 1;
    ctx.font = "10px sans-serif";
    
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
        const factor = i / steps;
        const yPos = canvas.height - padding.bottom - (factor * h);
        
        ctx.strokeStyle = "#f1f5f9"; 
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(canvas.width - padding.right, yPos);
        ctx.stroke();

        ctx.fillStyle = "#64748b"; 
        ctx.textAlign = "right";
        ctx.fillText(+(minP + (maxP - minP) * factor).toFixed(2), padding.left - 10, yPos + 4);

        if (hasPortfolio) {
            ctx.fillStyle = "#006b4d";
            ctx.textAlign = "left";
            ctx.fillText(+(minPort + (maxPort - minPort) * factor).toFixed(0), canvas.width - padding.right + 10, yPos + 4);
        }
    }

    // --- Zeichnen der Linien ---
    // 1. Kurs (Dunkelgrau gestrichelt)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#94a3b8"; 
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((v, i) => {
        i === 0 ? ctx.moveTo(getX(i), getY(v)) : ctx.lineTo(getX(i), getY(v));
    });
    ctx.stroke();

    // 2. Portfolio (HSG Grün fett)
    if (hasPortfolio) {
        ctx.setLineDash([]); 
        ctx.strokeStyle = "#006b4d"; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        portfolioHistory.forEach((v, i) => {
            i === 0 ? ctx.moveTo(getX(i), getYPort(v)) : ctx.lineTo(getX(i), getYPort(v));
        });
        ctx.stroke();
    }
}

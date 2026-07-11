const ADMIN_NUMBER = "2250503380589";

let currentPrediction = {
    match: "Aucun match en cours",
    pronostic: "Pas de pronostic disponible pour le moment.",
    disponible: false
};

export default {
    async fetch(request, env, ctx) {
        if (request.method === "POST") {
            try {
                const data = await request.json();
                const message = data.message || data.text || "";
                const sender = data.sender || data.from || "";
                
                if (sender.includes(ADMIN_NUMBER)) {
                    if (message.toLowerCase().startsWith("mise à jour:")) {
                        const contenu = message.split(":", 2)[1].split("|");
                        if (contenu.length >= 2) {
                            currentPrediction.match = contenu[0].trim();
                            currentPrediction.pronostic = contenu[1].trim();
                            currentPrediction.disponible = true;
                            return new Response(JSON.stringify({ reply: "✅ Match et pronostic mis à jour !" }), { status: 200 });
                        }
                    }
                    return new Response(JSON.stringify({ reply: "Salut Boss ! Utilise : 'Mise à jour: Match | Prono'" }), { status: 200 });
                }
                
                else {
                    const messageMin = message.toLowerCase();
                    if (messageMin.includes("prono") || messageMin.includes("cote") || messageMin.includes("match")) {
                        if (currentPrediction.disponible) {
                            const reponseClient = `⚽ *PRONOSTIC VIRTUEL FIFA* ⚽\n\n⚔️ *Match :* ${currentPrediction.match}\n🔥 *Conseil :* ${currentPrediction.pronostic}\n\n⚠️ _Misez de manière responsable._`;
                            return new Response(JSON.stringify({ reply: reponseClient }), { status: 200 });
                        } else {
                            return new Response(JSON.stringify({ reply: "Aucun pronostic dispo pour le moment. ⏳" }), { status: 200 });
                        }
                    }
                    return new Response(JSON.stringify({ reply: "Bonjour ! Pour le pronostic, écris *PRONO* ou *COTE*." }), { status: 200 });
                }
            } catch (error) {
                return new Response(JSON.stringify({ error: "Erreur" }), { status: 500 });
            }
        }
        return new Response("Robot Actif", { status: 200 });
    }
};

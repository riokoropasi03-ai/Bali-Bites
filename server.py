import os
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder=".", static_url_path="")
app.secret_key = os.getenv("FLASK_SECRET_KEY", "development-only-change-me")

@app.get("/")
def index():
    return send_from_directory(".", "index.html")

@app.post("/api/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()[:1500]
    products = payload.get("products", [])
    if not message:
        return jsonify({"reply": "Coba ceritakan rasa jajanan yang kamu sukai."}), 400
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            product_context = "\n".join(
                f"- {p.get('name','Produk')}: kategori {p.get('category','')}, harga Rp{p.get('price',0)}. {p.get('description','')}"
                for p in products[:20] if isinstance(p, dict)
            )
            response = client.responses.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
                instructions=(
                    "Kamu adalah asisten rekomendasi jajanan khas Bali bernama BaliBites. "
                    "Jawab dalam bahasa Indonesia dengan ramah dan ringkas. Rekomendasikan hanya produk "
                    "dari katalog yang diberikan, jangan mengarang harga atau ketersediaan. "
                    "Jelaskan bahwa informasi katalog merupakan contoh jika relevan."
                ),
                input=f"Katalog:\n{product_context}\n\nPertanyaan pelanggan: {message}",
                max_output_tokens=250
            )
            return jsonify({"reply": response.output_text})
        except Exception:
            app.logger.exception("AI request failed; using local fallback.")
    s = message.lower()
    if any(k in s for k in ("manis", "legit", "susu", "kue")):
        names = "Pie Susu Bali, Dodol Bali, atau Pia Kacang Hijau"
    elif any(k in s for k in ("gurih", "renyah", "asin", "kacang", "keripik", "pedas")):
        names = "Kacang Disco, Keripik Singkong, atau Sambal Matah"
    elif any(k in s for k in ("tradisional", "khas", "lokal", "bali")):
        names = "Jaje Laklak, Pisang Rai, atau Pie Susu Bali"
    else:
        names = "Pie Susu Bali untuk rasa manis, Kacang Disco untuk sensasi renyah, atau Jaje Laklak untuk pilihan tradisional"
    return jsonify({"reply": f"Rekomendasi untukmu: {names}. Ini rekomendasi demo berdasarkan kata kunci; pilih produk di katalog untuk melihat harga."})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)

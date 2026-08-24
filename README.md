# 🛒 VoiceCart — Smart Voice Shopping Platform

A full-width, production-grade e-commerce shopping platform with voice commands, natural language processing, real product photos, user authentication, interactive checkout, and smart suggestions.

![VoiceCart](https://img.shields.io/badge/VoiceCart-v2.0.0-059669?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Enterprise Platform Features

### 🛒 Production E-Commerce Shopping Experience
- **Full-Width Widescreen Layout** — Responsive multi-column layout for desktop & mobile
- **Real Product Photography** — High-resolution photos for 200+ grocery items (apples, organic milk, sourdough bread, salmon, avocado, etc.)
- **Aisle Catalog Browser** — Filter products by 11 categories with 1-click `+ Add` actions
- **Sticky Order Summary Sidebar** — Live item count, categories breakdown, and estimated subtotal

### 🔐 Real Client-Side User Authentication
- **Account Registration & Sign In** — Register new accounts or log into existing ones (`demo@voicecart.com` / `password123`)
- **Credential Validation** — Real email & password checking with error alerts
- **Social OAuth Login Options** — Google & Apple quick sign-in
- **Session Persistence** — Account state saved in LocalStorage with user profile badge in top header

### 💳 Interactive Multi-Step Checkout & Address Editor
- **Custom Address Editor** — Add & edit recipient name, street address, apt/suite, city, ZIP code, and delivery notes
- **Delivery Slots** — Express 30–45 min delivery, Today Afternoon, or Tomorrow
- **Multiple Payment Options** — Credit/Debit Card input, Apple/Google Pay, Cash on Delivery
- **Promo Discount Codes** — Enter `VOICECART10` for 10% off
- **Order Receipt Confirmation** — Order ID generation (`#VC-XXXXXX`), summary, and cart reset

### 🎤 Voice Commands & NLP Pipeline
- **Continuous Speech Recognition** — Multilingual Web Speech API across 14 languages
- **Instant NLP Parsing** — Natural phrase understanding ("Add 2 gallons of milk", "Find toothpaste under $5")
- **Interactive Command Pills** — 1-click voice command test chips in top hero banner

---

## 🖼️ How to Add Custom Local Product Images

VoiceCart automatically loads high-resolution product photos from Unsplash CDN. If you want to add your own local product images:

1. Create a folder named `public/images/products/` in the project root:
   ```bash
   mkdir -p public/images/products
   ```
2. Save your product image files using lowercase hyphenated names:
   - `public/images/products/apples.jpg`
   - `public/images/products/milk.jpg`
   - `public/images/products/sourdough.jpg`
   - `public/images/products/almond-milk.jpg`

The application will automatically detect and prioritize local images from `public/images/products/`, falling back smoothly to CDN images!

---

## 🚀 Getting Started

### Installation & Run

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

The app will be live at `http://localhost:5173/`

---

## 📄 License
MIT

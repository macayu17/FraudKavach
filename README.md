# 🛡️ FraudKavach - Smart Payment Insights & Fraud Awareness Platform

A **premium fintech web application** that simulates card payments, provides real-time fraud awareness insights, and offers visual spending analytics. Built as a portfolio-ready demonstration of modern full-stack development practices.

*"Kavach" (कवच) means "Shield" in Hindi – protecting your finances with intelligent fraud detection.*

---

## ✨ Features

### 🔒 Authentication & Security
- JWT-based secure authentication
- Protected routes with middleware validation
- Secure password hashing with bcrypt

### 💳 Virtual Card Management
- Create unlimited virtual payment cards
- Premium card designs (Blue, Gold, Black)
- Custom card holder names and spending limits
- 3D flip animation revealing CVV on hover
- Freeze/Unfreeze cards instantly

### 📊 Smart Analytics Dashboard
- Real-time spending visualizations with Chart.js
- Category-based expense breakdown
- 7-day spending trends
- Dynamic KPI stat cards

### 🧠 AI-Powered Insights
- Heuristic spending analysis engine
- Personalized financial advice
- Spending pattern recognition
- Fraud risk alerts

### 💰 Smart Budgeting
- Set category-wise budget limits
- Visual progress tracking
- Over-budget alerts
- Monthly reset functionality

### 🛡️ Fraud Awareness Engine
- Rule-based risk scoring
- Real-time transaction flagging
- Risk explanations in UI
- Educational fraud prevention tips

### 🎨 Premium UI/UX
- Mesh gradient backgrounds
- Glassmorphism effects
- Dark mode support
- Framer Motion animations
- Fully responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (portable, zero-config) |
| **Charts** | Chart.js with React-Chartjs-2 |
| **Auth** | JWT (JSON Web Tokens) |
| **Icons** | Lucide React |
| **Styling** | TailwindCSS + Custom CSS |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/paypulse.git
   cd paypulse
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
paypulse/
├── server/                  # Backend API
│   ├── controllers/         # Route handlers
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, error handling
│   ├── services/            # Business logic
│   ├── database.js          # SQLite setup
│   └── index.js             # Server entry
│
├── src/                     # Frontend React App
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Sidebar, Header
│   │   ├── Dashboard/       # StatCards, Charts
│   │   ├── Cards/           # CreditCard component
│   │   ├── Transactions/    # Transaction table
│   │   └── ui/              # Button, Input primitives
│   ├── pages/               # Route pages
│   ├── context/             # Auth context
│   └── App.jsx              # Router setup
│
├── public/                  # Static assets
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login & get JWT |

### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get user's cards |
| POST | `/api/cards` | Create virtual card |
| PATCH | `/api/cards/:id/status` | Freeze/Unfreeze |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get transaction history |
| POST | `/api/transactions` | Simulate payment |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get stats & insights |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all budgets |
| POST | `/api/budgets` | Set budget limit |

---

## 🎨 Screenshots

| Dashboard | Virtual Cards |
|-----------|---------------|
| ![Dashboard](./docs/dashboard.png) | ![Cards](./docs/cards.png) |

| Budgets | Analytics |
|---------|-----------|
| ![Budgets](./docs/budgets.png) | ![Analytics](./docs/analytics.png) |

---

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory:

```env
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ayush Kumar** 
LinkedIn: https://www.linkedin.com/in/anayush14/  
Portfolio: https://ayushworks-ashen.vercel.app/


---

<p align="center">
  Made with ❤️ using React + Node.js
</p>

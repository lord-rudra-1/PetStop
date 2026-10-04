# PetStop 🐾

PetStop is a comprehensive full-stack web application dedicated to pet adoption and pet care services. It provides a seamless platform for users to browse available pets, submit adoption requests, and schedule professional pet care services like grooming and sitting.

## 🚀 Features

- **Pet Adoption Marketplace:** Browse through a beautifully organized catalog of pets waiting for their forever homes.
- **Service Bookings:** Need a pet sitter or a groomer? Use the Pet Care portal to request services easily.
- **Dynamic Database:** Fully powered by a modern backend architecture using Express and Sequelize.
- **Responsive UI:** Built with React to ensure a flawless experience across desktop and mobile devices.

## 🛠 Tech Stack

- **Frontend:** React, React Router, Redux, Axios
- **Backend:** Node.js, Express.js, Sequelize (ORM)
- **Database:** PostgreSQL (via Supabase) / SQLite (Fallback for local testing)
- **Deployment:** Vercel

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lord-rudra-1/PetStop.git
   cd PetStop
   ```

2. **Install Backend Dependencies & Configure DB:**
   The backend is configured to connect to PostgreSQL.
   ```bash
   cd backend
   npm install
   npm install pg pg-hstore
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the application:**
   You can run both the frontend and backend concurrently from the root directory:
   ```bash
   cd ..
   npm run dev
   ```

## 🌐 Environment Variables

To connect to your own database, create a `.env` file in the root directory:

```env
PORT=5002
DIALECT=postgres
HOST=your-db-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
PASS=your-secure-password
```

*(Note: If no database credentials are provided, the application will automatically fallback to creating a local SQLite file to allow immediate local development!)*

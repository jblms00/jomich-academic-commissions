# JoMich's Academic Commissions - Website Project

This project contains the complete setup for the JoMich's Academic Commissions website, built from scratch with a React (Vite) frontend and a Vanilla PHP + MySQL backend.

## Project Structure

- `/frontend`: React application using Vite and SCSS Modules.
- `/backend`: PHP API endpoints for auth, proofs, reviews, and settings.
- `/database`: Contains the `setup.sql` script to initialize the MySQL database.

## Prerequisites

- [Node.js](https://nodejs.org/) (for running the React frontend)
- A local web server stack like [XAMPP](https://www.apachefriends.org/), WAMP, or Laragon (for PHP and MySQL)

## Setup Instructions

### 1. Database Setup
1. Open your MySQL management tool (e.g., phpMyAdmin).
2. Import the `database/setup.sql` file. This will:
   - Create a database named `jomich_web_db`.
   - Create the necessary tables.
   - Insert default website settings.
   - Insert a default admin user.

### 2. Backend Setup
1. Move the entire `jomich-web` folder into your local server's document root (e.g., `htdocs` for XAMPP or `www` for WAMP).
   - *Important*: The frontend API calls currently expect the backend to be accessible at `http://localhost/jomich-web/backend/api`. If your folder name or path is different, update the `baseURL` in `frontend/src/services/api.js`.
2. Open `backend/config/database.php` and verify the database credentials (default is `root` with no password).
3. Ensure the `backend/uploads` folder has write permissions so the PHP script can save uploaded images.

### 3. Frontend Setup
1. Open a terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Credentials

- **URL**: `http://localhost:5173/admin/login` (or whatever port Vite uses)
- **Username**: `admin`
- **Password**: `admin123`

*(Note: Please change the admin credentials in the database before going to production.)*

## Design & Features Notes

- **Aesthetics**: The design utilizes the custom JoMich color palette defined in `frontend/src/styles/_variables.scss`.
- **Animations**: A custom 3x3 ripple loader is implemented globally, along with scroll-reveal animations for sections.
- **Responsiveness**: The site is built with a mobile-first approach using fluid typography and clamp().
- **Privacy**: The admin dashboard is hidden from the public UI. The "Proofs" and "Reviews" sections will display a professional empty state if no data is present.

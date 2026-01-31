# Run Backend on Port 4000

## 1. Environment

A `.env` file is already in the `backend` folder with:

- `PORT=4000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/startup-benefits`
- `JWT_SECRET=your-super-secret-jwt-key-change-in-production`

## 2. MongoDB

The backend needs MongoDB. Choose one:

**Option A – Local MongoDB**

- Install [MongoDB Community](https://www.mongodb.com/try/download/community) and start the MongoDB service,  
  **or**
- Run MongoDB in Docker:  
  `docker run -d -p 27017:27017 --name mongo mongo:latest`

**Option B – MongoDB Atlas (cloud)**

- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
- Get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/startup-benefits`).
- In `backend/.env`, set:  
  `MONGODB_URI=<your-atlas-connection-string>`

## 3. Start the backend

In a terminal:

```bash
cd backend
npm run dev
```

You should see: **Backend running on http://localhost:4000**

Then the frontend (Sign up / Log in) will be able to reach the API at `http://localhost:4000`.

## 4. Optional: seed data

After the backend is running (and MongoDB is connected), in another terminal:

```bash
cd backend
npm run seed
```

This adds sample deals and demo users (e.g. `verified@example.com` / `verified123`).

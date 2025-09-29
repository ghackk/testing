ZestFindz Debugging Challenge - Candidate Instructions

Backend:
1. cd backend
2. npm install
3. npm start   # starts API on http://localhost:5000

Frontend (create-react-app):
1. npx create-react-app frontend
2. Replace src/App.js and src/components/ProductList.js with provided files
3. cd frontend && npm install
4. npm start   # opens http://localhost:3000

Goal:
- Fix bugs so product list shows results with working search (case-insensitive), pagination, and price formatting.
- Ensure frontend can call backend (CORS), and API returns proper status codes (404 or empty items as per your policy).
- Remove any secret leaks.
- Commit at least 3 times and be ready to explain fixes.

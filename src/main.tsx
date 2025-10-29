import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/style.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import AuthProvider from "./auth/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </Provider>
  </StrictMode>
);

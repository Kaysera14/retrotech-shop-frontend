import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/index-page";
import { NotFound } from "./pages/not-found";
import { Header } from "./components/header";
import { BottomNavBar } from "./components/bottom-navbar";
import NewUserPage from "./pages/new-user";
import { ValidateUserPage } from "./pages/validation-page";
import { LoginUserPage } from "./pages/login-page";
import { AuthContextProvider } from "./contexts/auth-context";
import ModifyUserPage from "./pages/modify-user";

function App() {
  return (
    <AuthContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginUserPage />} />
        <Route path="/register" element={<NewUserPage />} />
        <Route path="/users/validate" element={<ValidateUserPage />} />
        <Route path="/users/update" element={<ModifyUserPage />} />

        {/* SIEMPRE AL FINAL */}
        <Route path="*" element={<NotFound />} />
        {/* SIEMPRE AL FINAL */}
      </Routes>
      <BottomNavBar />
    </AuthContextProvider>
  );
}

export default App;

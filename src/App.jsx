import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";
import Filter from "./pages/Filter.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Income from "./pages/Income.jsx";
import Login from "./pages/Login.jsx";
import Hero from "./pages/Hero.jsx";
import Toaster from "./components/Toaster.jsx";

const App = () => {
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/filter" element={<Filter />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
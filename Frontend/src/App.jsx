import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Plans from './pages/Plans.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';


const secondaryNavLinks = [
  { to: '/signup', label: 'Sign up' },
  { to: '/home', label: 'Home' },
  { to: '/plans', label: 'Plans' },
];

function AppNav() {
  const { pathname } = useLocation();

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        {secondaryNavLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.navLink,
              ...(pathname === to ? styles.navLinkActive : {}),
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function AppShell() {
  return (
    <div style={styles.app}>
      <AppNav />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/plans" element={<Plans />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '15px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: 500,
  },
  navLinkActive: {
    color: '#0f172a',
    fontWeight: 600,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};
/*
import { useState, useEffect } from "react";

function App() {
  const [fruits, setFruits] = useState(["apple", "banana", "orange"]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    setResult(fruits.map((fruit) => fruit.toUpperCase()));
  }, [fruits]);

  return (
    <div>
      <p>Hello Sohan</p>

      <ul>
        {result.map((fruit, index) => (
          <li >{fruit}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

const api = axios.create();

async function login({a,b}){
  const resposne = await api.post();
  return response.data

}

function Handlesubmit(){
login({email,pwd})
}



function TestPage(){
  const [email, setemail] = useState('')
  const [pwd, setPwd] = useState('')

  return (
<div id='root'>
  <form
  onSubmit = {handleSubmit}>
 
<input
value = email
onChange = {(e)=> setEmail(e.target.value)}
onChange
/>

<input
value = pwd
onChange = {(e)=> setPwd(e.target.value)}
onChange
/>

<button
type = submit>
Submit
</button>

  </form>

</div>
)
}



*/
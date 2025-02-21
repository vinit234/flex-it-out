import './App.css';
import Footer from './components/footer/Footer';
import HeroSection from './components/hero-section/HeroSection';
import Join from './components/join/Join';
import Plans from './components/plans/Plans';
import Programs from './components/programs/Programs';
import Reasons from './components/reasons/Reasons';
import Testimonials from './components/testimonials/Testimonials';
import Leaderboard from './Pages/Leaderboard/Leaderboard';
import Header from './components/header/Header';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Aimodel from './Pages/Aimodel/Aimodel';
import Challenges from './Pages/Challenges/challenges';
import Challengeaimodel from './Pages/ChallengeAiModel/Challengeaimodel';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';
  
  console.log('Current Path:', location.pathname);
  console.log('Show Header:', showHeader);

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analytics" element={<Aimodel />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challengesai" element={<Challengeaimodel/>} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <HeroSection />
      <Programs />
      <Reasons />
      <Plans />
      <Testimonials />
      <Join />
      <Footer />
    </>
  );
}

export default App;
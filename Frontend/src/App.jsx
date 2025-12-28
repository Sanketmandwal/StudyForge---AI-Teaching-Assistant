import React from 'react'
import {BrowserRouter , Routes , Route , Navigate } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage.jsx'
import RegisterPage from './pages/Auth/RegisterPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProfilePage from './pages/Profile/ProfilePage.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import DocumentListPage from './pages/Documents/DocumentListPage.jsx'
import DocumentDetailPage from './pages/Documents/DocumentDetailPage.jsx'
import FlashcardPage from './pages/Flashcards/FlashcardPage'
import FlashcardListPage from './pages/Flashcards/FlashcardListPage.jsx'
import QuizTakePage from './pages/Quizzes/QuizTakePage.jsx'
import QuizResultPage from './pages/Quizzes/QuizResultPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

function App() {
  const { isAuthenticated, loading } = useAuth();
  if(loading){
    return <div className='flex items-center justify-center h-screen'>
      <p>loading.....</p>
    </div>
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route 
      path='/'
      element={isAuthenticated ? <Navigate to='/dashboard' replace/> : <Navigate to='/login' replace/>}
      />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />

    <Route element={<ProtectedRoute/>}>
    <Route path='/dashboard' element={<DashboardPage/>}/>
    <Route  path='/documents' element={<DocumentListPage/>} />
    <Route  path='/documents/:id' element={<DocumentDetailPage/>} />
    <Route path='/flashcard' element={<FlashcardListPage/>} />
    <Route  path='/documents/:id/flashcard' element={<FlashcardPage/>} />
    <Route path='/quizzes/:quizId' element={<QuizTakePage/>} />
    <Route path='/quizzes/:quizId/results' element={<QuizResultPage/>} />
    <Route path='/profile' element={<ProfilePage/>} />

    </Route>


      <Route path="*" element={<NotFoundPage/>}  />
    </Routes>

    </BrowserRouter>

  )
}

export default App

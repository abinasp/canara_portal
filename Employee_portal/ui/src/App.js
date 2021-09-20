import './App.css';

import UserForm from './components/UserForm';
import reverise from './reverise.js'
import { useEffect } from 'react';

function App() {
  
  // useEffect(() => {
  //   reverise();
  // },[reverise])
  
  return (
    <div>
      <UserForm  reverise = {reverise}/>
    </div>
  );
}

export default App;

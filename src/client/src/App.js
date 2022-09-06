import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const onInputChange = event => {
    setUsername(event.target.value);
  }

  const tryLogIn = async event => {
    event.preventDefault();
    const data = await axios.get(`http://localhost:4000/users?name=${username}`)
    if (data.data.length < 1) {
      setUsername('')
      setPlaceholder('Oops! Try Again')
    } else {
      window.location.href = '/' + data.data[0].name
    }
  }

  return (
    <div>
      <h1>Welcome to My Tasks Manager (or TODO)</h1>
      <h4>Probably the Best Tasks Manager in the World</h4>
      <h3>
        Please enter your username to proceed or
        <button onClick={() => {
          window.open(
            "/sign-up",
            "_blank",
            "height=500,width=500,top=250,left=500"
          )
        }}>sign up</button>
        if you're not signed yet!
      </h3>
      <form>
        <label>Enter Username: </label>
        <input
          value={username}
          type="text"
          onChange={onInputChange}
          placeholder={placeholder} />
        <button onClick={tryLogIn}>Log in</button>
      </form>
    </div>
  );
}

export default App;

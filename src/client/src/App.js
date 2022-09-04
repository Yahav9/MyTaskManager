function App() {
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
        <input type="text" />
        <button>Log in</button>
      </form>
    </div>
  );
}

export default App;

import "./styles.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import "./i18n/i18n";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "./utils/theme";
import Logo from "./components/UI/Logo";


// Lazy loading components
const Room1 = React.lazy(() => import("./pages/room1"));
const Hall = React.lazy(() => import("./pages/hall"));
// const Login = React.lazy(() => import("./views/LoginPage/LoginPage"));
// const Signup = React.lazy(() => import("./views/SignupPage/SignupPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <ThemeProvider theme={theme}>

        <Router>
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            zIndex: 5,
            width: 100
          }}
        >
          {/* <Logo width={120} /> */}
        </div>
        <Switch>
          <Suspense fallback={null}>
            {/* <Route path='/login' render={(props) => <Login {...props} />} /> */}
            {/* <Route path='/signup' render={(props) => <Signup {...props} />} /> */}
            <Route path='/' render={(props) => <Dashboard {...props} />} />
            <Route path='/room-1' render={(props) => <Room1 {...props} />} />
            <Route path='/hall' render={(props) => <Hall {...props} />} />
            
          </Suspense>
        </Switch>
      </Router>


    </ThemeProvider>
  );
}

Sentry.init({
  dsn: "https://e46328c24ae04fc895282fd9209b286d@o363032.ingest.sentry.io/5420965"
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

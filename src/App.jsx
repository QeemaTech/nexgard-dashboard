import AppRoutes from "./routes/AppRoutes";
import AppBootstrap from "./components/layout/AppBootstrap";

function App() {
  return (
    <AppBootstrap>
      <AppRoutes />
    </AppBootstrap>
  );
}

export default App;

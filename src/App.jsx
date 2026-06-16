import AppRoutes from "./routes/AppRoutes";
import AppBootstrap from "./components/layout/AppBootstrap";
import PetCursor from "./components/cursor/PetCursor";

function App() {
  return (
    <AppBootstrap>
      <PetCursor />
      <AppRoutes />
    </AppBootstrap>
  );
}

export default App;

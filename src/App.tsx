import { Navigate, Route, Routes } from 'react-router-dom';
import PageTitle from './components/Common/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import Overview from './pages/Overview';
import Metrics from './pages/Metrics';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import Companies from './pages/Companies';
import Survey from './pages/Survey';
import Consent from './pages/Consent';
import AuthInitializer from './auth/AuthInitializer';

function App() {
  return (
    <>
      <AuthInitializer>
        <Routes>
          <Route
            path="/consent"
            element={
              <>
                <PageTitle title="Consent Form" />
                <Consent />
              </>
            }
          />
          <Route
            path="*"
            element={
              <Routes>
                <Route element={<DefaultLayout />}>
                  <Route
                    path="/"
                    element={<Navigate to="/overview" replace />}
                  />
                  <Route
                    path="/overview"
                    element={
                      <>
                        <PageTitle title="Hird Dashboard | Overview" />
                        <Overview />
                      </>
                    }
                  />
                  <Route
                    path="/metrics"
                    element={
                      <>
                        <PageTitle title="Hird Dashboard | Metrics" />
                        <Metrics />
                      </>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <>
                        <PageTitle title="Hird Dashboard | Settings" />
                        <Settings />
                      </>
                    }
                  />
                  <Route
                    path="/unauthorized"
                    element={
                      <>
                        <PageTitle title="Hird Dashboard | No permission" />
                        <Unauthorized />
                      </>
                    }
                  />
                  <Route
                    path="/companies"
                    element={
                      <>
                        <PageTitle title="Admin | companies" />
                        <Companies />
                      </>
                    }
                  />
                  <Route
                    path="/survey"
                    element={
                      <>
                        <PageTitle title="Admin | surveys" />
                        <Survey />
                      </>
                    }
                  />
                </Route>
                <Route
                  path="*"
                  element={
                    <>
                      <PageTitle title="Not found" />
                      <NotFound />
                    </>
                  }
                />
              </Routes>
            }
          />
        </Routes>
      </AuthInitializer>
    </>
  );
}

export default App;

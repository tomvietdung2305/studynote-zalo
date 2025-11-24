import { Switch, Route } from 'wouter';
import HomePage from '@/pages/index';
import StudentListPage from '@/pages/students';
import MessagesPage from '@/pages/messages';
import NotificationsPage from '@/pages/notifications';

export function Router() {
  return (
    <Switch>
      <Route path="/">
        {(params) => <HomePage />}
      </Route>
      <Route path="/students">
        {(params) => <StudentListPage />}
      </Route>
      <Route path="/messages">
        {(params) => <MessagesPage />}
      </Route>
      <Route path="/notifications">
        {(params) => <NotificationsPage />}
      </Route>
      
      {/* Catch-all for 404 */}
      <Route>
        <div className="flex items-center justify-center h-screen">
          <h1>404 - Trang không tìm thấy</h1>
        </div>
      </Route>
    </Switch>
  );
}

import { Route, Routes } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { HomePage } from '@/pages/HomePage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { TagPage } from '@/pages/TagPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { EditorPage } from '@/pages/EditorPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ModerationPage } from '@/pages/ModerationPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RequireRole } from '@/components/auth/RequireRole';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageTransition />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/tag/:slug" element={<TagPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/editor/:id"
          element={
            <RequireRole roles={['AUTHOR', 'EDITOR', 'ADMIN']}>
              <EditorPage />
            </RequireRole>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireRole roles={['READER', 'AUTHOR', 'EDITOR', 'ADMIN']}>
              <DashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/moderation"
          element={
            <RequireRole roles={['EDITOR', 'ADMIN']}>
              <ModerationPage />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

import { Redirect } from "expo-router";
import { useAuth } from '@/context/auth';
import Loading from '@/components/Loading';

export default function App() {
  const { userId, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!userId) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/MainNav/feed" />;
}

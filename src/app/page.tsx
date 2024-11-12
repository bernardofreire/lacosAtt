import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Se o usuário está autenticado, redireciona para o dashboard
    redirect('/app');
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    redirect('/auth');
  }

  return null;
}

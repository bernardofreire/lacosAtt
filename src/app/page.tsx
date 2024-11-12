import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      // Redireciona para o dashboard se o usuário estiver autenticado
      redirect('/app');
    } else {
      // Redireciona para a página de login se não estiver autenticado
      redirect('/auth');
    }
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    notFound(); // Trata erro de sessão com uma página 404 ou redireciona conforme necessário
  }

  return null;
}
